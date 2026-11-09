"""
test_skills_service.py — Happy-path tests for skills_service.
"""

from __future__ import annotations

from unittest.mock import patch

import pytest

from app.core.session import get_session
from app.models.requests import AnalyzeSkillsRequest
from app.models.skills import SkillGapReport
from app.services import skills_service


@pytest.mark.asyncio
async def test_analyze_gaps_returns_report(mock_langflow_client, sample_session):
    """analyze_gaps should return a SkillGapReport with at least one gap."""
    request = AnalyzeSkillsRequest(
        current_skills=["Python", "SQL"],
        target_role="Data Engineer",
    )

    with patch("app.services.skills_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_SKILL_GAP_ANALYSIS = "skill-gap-analysis"

        result = await skills_service.analyze_gaps(
            sample_session, request, mock_langflow_client
        )

    assert isinstance(result, SkillGapReport)
    assert result.target_role == "Data Engineer"
    assert len(result.gaps) > 0
    assert result.mock is True


@pytest.mark.asyncio
async def test_analyze_gaps_updates_session(mock_langflow_client, sample_session):
    """analyze_gaps should write the SkillGapReport to the session."""
    request = AnalyzeSkillsRequest(
        current_skills=["Python"],
        target_role="Data Scientist",
    )

    with patch("app.services.skills_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_SKILL_GAP_ANALYSIS = "skill-gap-analysis"

        await skills_service.analyze_gaps(
            sample_session, request, mock_langflow_client
        )

    session = get_session(sample_session)
    assert session.skill_gaps is not None
    assert session.skill_gaps.target_role == "Data Scientist"


@pytest.mark.asyncio
async def test_analyze_gaps_fallback_without_langflow(sample_session):
    """When LANGFLOW_BASE_URL is empty, analyze_gaps falls back to granite_stub."""
    request = AnalyzeSkillsRequest(
        current_skills=["Java", "Spring"],
        target_role="Backend Developer",
    )
    dummy_client = object()

    with patch("app.services.skills_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = ""
        mock_cfg.FLOW_ID_SKILL_GAP_ANALYSIS = ""

        result = await skills_service.analyze_gaps(
            sample_session, request, dummy_client  # type: ignore
        )

    assert isinstance(result, SkillGapReport)
    assert result.target_role == "Backend Developer"
    assert result.mock is True
    assert len(result.gaps) > 0
