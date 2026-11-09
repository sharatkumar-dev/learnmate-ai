"""
recommendations_service — AI-powered course and resource recommendations.
"""

from __future__ import annotations

import json

from fastapi import HTTPException

from app.clients.langflow import LangflowClient
from app.core import config
from app.core.session import get_session, update_session
from app.models.recommendations import Recommendation, RecommendationList
from app.services import granite_stub
from app.services._langflow_helpers import parse_json_from_langflow_response

_VALID_TYPES: set[str] = {"course", "tutorial", "book", "video", "article"}


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
        langflow_inputs = {"input_value": json.dumps(inputs)}
        response = await langflow_client.run_flow(flow_id, langflow_inputs)
        return parse_json_from_langflow_response(response)
    except (HTTPException, ValueError):
        return await granite_stub.run_stub(flow_type, inputs)


def _parse_recommendation_list(data: dict) -> RecommendationList:
    """Parse a raw response dict into a RecommendationList model."""
    raw_recs = data.get("recommendations", [])
    recs: list[Recommendation] = []
    for r in raw_recs:
        res_type = r.get("type", "course")
        if res_type not in _VALID_TYPES:
            res_type = "course"
        recs.append(
            Recommendation(
                title=r.get("title", ""),
                url=r.get("url", "#"),
                type=res_type,  # type: ignore[arg-type]
                duration=r.get("duration", ""),
                skill=r.get("skill", ""),
            )
        )
    return RecommendationList(
        recommendations=recs,
        mock=data.get("_mock", False),
    )


async def get_recommendations(
    session_id: str,
    langflow_client: LangflowClient,
) -> RecommendationList:
    """Get course/resource recommendations based on session skill gaps and profile."""
    session = get_session(session_id)
    skill_gaps_list = (
        [g.skill for g in session.skill_gaps.gaps] if session.skill_gaps else []
    )
    target_role = session.profile.target_role if session.profile else ""
    inputs = {
        "skill_gaps": skill_gaps_list,
        "target_role": target_role,
        "learning_style": "self-paced",
    }
    data = await _call_flow_or_stub(
        config.FLOW_ID_COURSE_RECOMMENDATIONS,
        "course-recommendations",
        inputs,
        langflow_client,
    )
    rec_list = _parse_recommendation_list(data)
    update_session(session_id, recommendations=rec_list)
    return rec_list
