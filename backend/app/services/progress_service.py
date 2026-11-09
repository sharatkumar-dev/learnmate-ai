"""
progress_service — Milestone progress tracking and AI-generated progress summaries.
"""

from __future__ import annotations

import json

from fastapi import HTTPException

from app.clients.langflow import LangflowClient
from app.core import config
from app.core.session import get_session, update_session
from app.models.progress import ProgressState, ProgressSummary
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
        langflow_inputs = {"input_value": json.dumps(inputs)}
        response = await langflow_client.run_flow(flow_id, langflow_inputs)
        return parse_json_from_langflow_response(response)
    except (HTTPException, ValueError):
        return await granite_stub.run_stub(flow_type, inputs)


async def update_progress(session_id: str, milestone_id: str) -> ProgressState:
    """Record a completed milestone in the session's progress state."""
    session = get_session(session_id)
    all_milestone_ids = (
        [m.id for m in session.pathway.milestones] if session.pathway else []
    )
    completed = list(set(session.progress.completed + [milestone_id]))
    new_progress = ProgressState(milestones=all_milestone_ids, completed=completed)
    update_session(session_id, progress=new_progress)
    return new_progress


async def get_summary(
    session_id: str,
    langflow_client: LangflowClient,
) -> ProgressSummary:
    """Return an AI-generated narrative summary of the learner's progress."""
    session = get_session(session_id)
    target_role = session.profile.target_role if session.profile else ""
    inputs = {
        "completed_milestones": session.progress.completed,
        "goals": target_role,
        "target_role": target_role,
    }
    data = await _call_flow_or_stub(
        config.FLOW_ID_PROGRESS_SUMMARY,
        "progress-summary",
        inputs,
        langflow_client,
    )
    return ProgressSummary(
        narrative=data.get("narrative", ""),
        completion_pct=float(data.get("completion_pct", 0.0)),
        next_steps=data.get("next_steps", []),
        mock=data.get("_mock", False),
    )
