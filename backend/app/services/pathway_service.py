"""
pathway_service — AI-powered learning pathway generation and adaptation.
"""

from __future__ import annotations

import json

from fastapi import HTTPException

from app.clients.langflow import LangflowClient
from app.core import config
from app.core.session import get_session, update_session
from app.models.pathway import Milestone, Pathway
from app.models.requests import AdaptPathwayRequest, GeneratePathwayRequest
from app.services import granite_stub
from app.services._langflow_helpers import parse_json_from_langflow_response


async def _call_flow_or_stub(
    flow_id: str,
    flow_type: str,
    inputs: dict,
    langflow_client: LangflowClient,
) -> dict:
    """Call Langflow if configured; otherwise fall back to granite_stub."""
    if not flow_id or not config.LANGFLOW_BASE_URL:
        return await granite_stub.run_stub(flow_type, inputs)

    try:
        # Embed the structured inputs as a JSON string in input_value so that
        # GraniteStub (and real Granite) receive them through the chat input.
        langflow_inputs = {"input_value": json.dumps(inputs)}
        response = await langflow_client.run_flow(flow_id, langflow_inputs)
        return parse_json_from_langflow_response(response)
    except (HTTPException, ValueError):
        # Langflow unreachable or returned a malformed response → fall back.
        return await granite_stub.run_stub(flow_type, inputs)


def _parse_pathway(data: dict) -> Pathway:
    """Parse a raw response dict into a Pathway model."""
    raw_milestones = data.get("milestones", [])
    milestones = [
        Milestone(
            id=m.get("id", f"m{i+1}"),
            title=m.get("title", ""),
            description=m.get("description", ""),
            resources=m.get("resources", []),
            order=m.get("order", i + 1),
            completed=m.get("completed", False),
        )
        for i, m in enumerate(raw_milestones)
    ]
    return Pathway(
        milestones=milestones,
        estimated_duration_weeks=data.get("estimated_duration_weeks", 12),
        target_role=data.get("target_role", ""),
        mock=data.get("_mock", False),
    )


async def generate_pathway(
    session_id: str,
    request: GeneratePathwayRequest,
    langflow_client: LangflowClient,
) -> Pathway:
    """Generate a personalized learning pathway for the learner profile."""
    inputs = {
        "target_role": request.profile.target_role,
        "current_skills": request.profile.current_skills,
        "interests": request.profile.interests,
        "time_available": request.profile.time_available_hours_per_week,
    }
    data = await _call_flow_or_stub(
        config.FLOW_ID_PATHWAY_GENERATION,
        "pathway-generation",
        inputs,
        langflow_client,
    )
    pathway = _parse_pathway(data)
    update_session(session_id, profile=request.profile, pathway=pathway)
    return pathway


async def adapt_pathway(
    session_id: str,
    request: AdaptPathwayRequest,
    langflow_client: LangflowClient,
) -> Pathway:
    """Adapt the current pathway based on progress and learner feedback."""
    session = get_session(session_id)
    current_pathway_dict = session.pathway.model_dump() if session.pathway else {}
    inputs = {
        "current_pathway": current_pathway_dict,
        "completed_milestones": request.completed_milestone_ids,
        "feedback": request.feedback,
    }
    data = await _call_flow_or_stub(
        config.FLOW_ID_ADAPTIVE_UPDATE,
        "adaptive-update",
        inputs,
        langflow_client,
    )

    # The adaptive-update flow returns { updated_pathway: {...}, changes_summary: "..." }
    # We parse updated_pathway as the new Pathway; if missing, fall back to current.
    updated_raw = data.get("updated_pathway", current_pathway_dict)
    # Re-run pathway-generation stub with the same profile to get full milestone list
    # if the updated_pathway dict is too sparse to build a Pathway from.
    if not updated_raw.get("milestones"):
        # updated_pathway lacks milestones → rebuild from current session pathway
        if session.pathway:
            # Mark completed milestones
            updated_milestones = [
                m.model_copy(
                    update={"completed": m.id in request.completed_milestone_ids}
                )
                for m in session.pathway.milestones
            ]
            adapted = session.pathway.model_copy(
                update={"milestones": updated_milestones, "mock": data.get("_mock", True)}
            )
        else:
            adapted = Pathway(
                milestones=[],
                estimated_duration_weeks=12,
                target_role="",
                mock=data.get("_mock", True),
            )
    else:
        adapted = _parse_pathway({**updated_raw, "_mock": data.get("_mock", False)})

    update_session(session_id, pathway=adapted)
    return adapted
