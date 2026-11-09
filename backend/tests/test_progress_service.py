"""
test_progress_service.py — Happy-path tests for progress_service.
"""

from __future__ import annotations

from unittest.mock import patch

import pytest

from app.core.session import get_session, update_session
from app.models.pathway import Milestone, Pathway
from app.models.progress import ProgressState, ProgressSummary
from app.services import progress_service


@pytest.fixture
def session_with_pathway(sample_session: str) -> str:
    """Extend sample_session with a seeded Pathway containing known milestones."""
    pathway = Pathway(
        milestones=[
            Milestone(
                id="m1",
                title="Foundation",
                description="Core skills",
                resources=[],
                order=1,
            ),
            Milestone(
                id="m2",
                title="Applied Practice",
                description="Hands-on work",
                resources=[],
                order=2,
            ),
            Milestone(
                id="m3",
                title="Capstone",
                description="Final project",
                resources=[],
                order=3,
            ),
        ],
        estimated_duration_weeks=6,
        target_role="Data Engineer",
        mock=True,
    )
    update_session(sample_session, pathway=pathway)
    return sample_session


@pytest.mark.asyncio
async def test_update_progress_adds_milestone(session_with_pathway):
    """update_progress should add the milestone_id to progress.completed."""
    result = await progress_service.update_progress(session_with_pathway, "m1")

    assert isinstance(result, ProgressState)
    assert "m1" in result.completed


@pytest.mark.asyncio
async def test_update_progress_idempotent(session_with_pathway):
    """Calling update_progress twice with the same ID should not duplicate it."""
    await progress_service.update_progress(session_with_pathway, "m1")
    result = await progress_service.update_progress(session_with_pathway, "m1")

    assert result.completed.count("m1") == 1


@pytest.mark.asyncio
async def test_update_progress_accumulates_milestones(session_with_pathway):
    """update_progress called with different IDs should accumulate them."""
    await progress_service.update_progress(session_with_pathway, "m1")
    result = await progress_service.update_progress(session_with_pathway, "m2")

    assert "m1" in result.completed
    assert "m2" in result.completed


@pytest.mark.asyncio
async def test_get_summary_returns_progress_summary(
    mock_langflow_client, session_with_pathway
):
    """get_summary should return a ProgressSummary with a non-empty narrative."""
    await progress_service.update_progress(session_with_pathway, "m1")

    with patch("app.services.progress_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_PROGRESS_SUMMARY = "progress-summary"

        result = await progress_service.get_summary(
            session_with_pathway, mock_langflow_client
        )

    assert isinstance(result, ProgressSummary)
    assert len(result.narrative) > 0
    assert result.mock is True
    assert len(result.next_steps) > 0


@pytest.mark.asyncio
async def test_get_summary_references_target_role(
    mock_langflow_client, session_with_pathway
):
    """The progress summary narrative should reference the learner's target role."""
    with patch("app.services.progress_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_PROGRESS_SUMMARY = "progress-summary"

        result = await progress_service.get_summary(
            session_with_pathway, mock_langflow_client
        )

    assert "Data Engineer" in result.narrative


@pytest.mark.asyncio
async def test_get_summary_fallback_without_langflow(session_with_pathway):
    """When LANGFLOW_BASE_URL is empty, get_summary falls back to granite_stub."""
    dummy_client = object()

    with patch("app.services.progress_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = ""
        mock_cfg.FLOW_ID_PROGRESS_SUMMARY = ""

        result = await progress_service.get_summary(
            session_with_pathway, dummy_client  # type: ignore
        )

    assert isinstance(result, ProgressSummary)
    assert result.mock is True
