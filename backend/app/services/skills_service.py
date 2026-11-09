"""
skills_service — AI-powered skill gap analysis.
"""

from __future__ import annotations

import json
from typing import Literal

from fastapi import HTTPException

from app.clients.langflow import LangflowClient
from app.core import config
from app.core.session import update_session
from app.models.requests import AnalyzeSkillsRequest
from app.models.skills import SkillGap, SkillGapReport
from app.services import granite_stub
from app.services._langflow_helpers import parse_json_from_langflow_response

_VALID_PRIORITIES: set[str] = {"high", "medium", "low"}


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


def _parse_skill_gap_report(data: dict) -> SkillGapReport:
    """Parse a raw response dict into a SkillGapReport model."""
    raw_gaps = data.get("gaps", [])
    gaps: list[SkillGap] = []
    for g in raw_gaps:
        priority = g.get("priority", "medium")
        if priority not in _VALID_PRIORITIES:
            priority = "medium"
        gaps.append(
            SkillGap(
                skill=g.get("skill", ""),
                priority=priority,  # type: ignore[arg-type]
                rationale=g.get("rationale", ""),
            )
        )
    return SkillGapReport(
        gaps=gaps,
        target_role=data.get("target_role", ""),
        mock=data.get("_mock", False),
    )


async def analyze_gaps(
    session_id: str,
    request: AnalyzeSkillsRequest,
    langflow_client: LangflowClient,
) -> SkillGapReport:
    """Run a skill gap analysis for the given current skills and target role."""
    inputs = {
        "current_skills": request.current_skills,
        "target_role": request.target_role,
    }
    data = await _call_flow_or_stub(
        config.FLOW_ID_SKILL_GAP_ANALYSIS,
        "skill-gap-analysis",
        inputs,
        langflow_client,
    )
    report = _parse_skill_gap_report(data)
    update_session(session_id, skill_gaps=report)
    return report
