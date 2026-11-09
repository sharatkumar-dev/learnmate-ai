"""
test_pathway_service.py — Happy-path tests for pathway_service.
"""

from __future__ import annotations

from unittest.mock import patch

import pytest

from app.core.session import create_session, get_session
from app.models.learner import LearnerProfile
from app.models.pathway import Pathway
from app.models.requests import AdaptPathwayRequest, GeneratePathwayRequest
from app.services import pathway_service


@pytest.mark.asyncio
async def test_generate_pathway_returns_pathway(
    mock_langflow_client, sample_session
):
    """generate_pathway should return a Pathway with milestones."""
    profile = LearnerProfile(
        target_role="Data Engineer",
        current_skills=["Python", "SQL"],
        interests=["Machine Learning"],
        time_available_hours_per_week=10.0,
    )
    request = GeneratePathwayRequest(profile=profile)

    with patch("app.services.pathway_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_PATHWAY_GENERATION = "pathway-generation"
        mock_cfg.FLOW_ID_ADAPTIVE_UPDATE = "adaptive-update"

        result = await pathway_service.generate_pathway(
            sample_session, request, mock_langflow_client
        )

    assert isinstance(result, Pathway)
    assert result.target_role == "Data Engineer"
    assert len(result.milestones) > 0
    assert result.mock is True  # granite_stub always returns _mock: True


@pytest.mark.asyncio
async def test_generate_pathway_updates_session(
    mock_langflow_client, sample_session
):
    """generate_pathway should persist the pathway and profile into the session."""
    profile = LearnerProfile(
        target_role="ML Engineer",
        current_skills=["Python"],
        interests=["Deep Learning"],
        time_available_hours_per_week=5.0,
    )
    request = GeneratePathwayRequest(profile=profile)

    with patch("app.services.pathway_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_PATHWAY_GENERATION = "pathway-generation"
        mock_cfg.FLOW_ID_ADAPTIVE_UPDATE = "adaptive-update"

        await pathway_service.generate_pathway(
            sample_session, request, mock_langflow_client
        )

    session = get_session(sample_session)
    assert session.pathway is not None
    assert session.profile is not None
    assert session.profile.target_role == "ML Engineer"


@pytest.mark.asyncio
async def test_adapt_pathway_returns_pathway(
    mock_langflow_client, sample_session
):
    """adapt_pathway should return an adapted Pathway."""
    # First generate a pathway so session has one
    profile = LearnerProfile(
        target_role="Data Engineer",
        current_skills=["Python", "SQL"],
        interests=["Machine Learning"],
        time_available_hours_per_week=10.0,
    )
    gen_request = GeneratePathwayRequest(profile=profile)

    with patch("app.services.pathway_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_PATHWAY_GENERATION = "pathway-generation"
        mock_cfg.FLOW_ID_ADAPTIVE_UPDATE = "adaptive-update"

        await pathway_service.generate_pathway(
            sample_session, gen_request, mock_langflow_client
        )

        adapt_request = AdaptPathwayRequest(
            feedback="I want more hands-on exercises",
            completed_milestone_ids=["m1"],
        )
        result = await pathway_service.adapt_pathway(
            sample_session, adapt_request, mock_langflow_client
        )

    assert isinstance(result, Pathway)
    # After adapt, the session pathway should be updated
    session = get_session(sample_session)
    assert session.pathway is not None


@pytest.mark.asyncio
async def test_generate_pathway_fallback_without_langflow(sample_session):
    """When LANGFLOW_BASE_URL is empty, generate_pathway falls back to granite_stub."""
    profile = LearnerProfile(
        target_role="Backend Developer",
        current_skills=["Java"],
        interests=["APIs"],
        time_available_hours_per_week=8.0,
    )
    request = GeneratePathwayRequest(profile=profile)
    dummy_client = object()  # not a real client — should never be called

    with patch("app.services.pathway_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = ""
        mock_cfg.FLOW_ID_PATHWAY_GENERATION = ""
        mock_cfg.FLOW_ID_ADAPTIVE_UPDATE = ""

        result = await pathway_service.generate_pathway(
            sample_session, request, dummy_client  # type: ignore
        )

    assert isinstance(result, Pathway)
    assert result.target_role == "Backend Developer"
    assert result.mock is True
