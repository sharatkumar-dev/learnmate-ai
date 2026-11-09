"""
test_recommendations_service.py — Happy-path tests for recommendations_service.
"""

from __future__ import annotations

from unittest.mock import patch

import pytest

from app.core.session import get_session
from app.models.recommendations import RecommendationList
from app.services import recommendations_service


@pytest.mark.asyncio
async def test_get_recommendations_returns_list(
    mock_langflow_client, sample_session
):
    """get_recommendations should return a RecommendationList with items."""
    with patch("app.services.recommendations_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_COURSE_RECOMMENDATIONS = "course-recommendations"

        result = await recommendations_service.get_recommendations(
            sample_session, mock_langflow_client
        )

    assert isinstance(result, RecommendationList)
    assert len(result.recommendations) > 0
    assert result.mock is True


@pytest.mark.asyncio
async def test_get_recommendations_updates_session(
    mock_langflow_client, sample_session
):
    """get_recommendations should persist the RecommendationList to the session."""
    with patch("app.services.recommendations_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_COURSE_RECOMMENDATIONS = "course-recommendations"

        await recommendations_service.get_recommendations(
            sample_session, mock_langflow_client
        )

    session = get_session(sample_session)
    assert session.recommendations is not None
    assert len(session.recommendations.recommendations) > 0


@pytest.mark.asyncio
async def test_get_recommendations_uses_skill_gaps(
    mock_langflow_client, sample_session
):
    """get_recommendations should pass skill gap names into the flow inputs."""
    call_args_store: list = []

    async def capture_run_flow(flow_id: str, inputs: dict) -> dict:
        call_args_store.append(inputs)
        return mock_langflow_client.run_flow.side_effect.__wrapped__(flow_id, inputs)  # type: ignore

    import json

    original_side_effect = mock_langflow_client.run_flow.side_effect

    async def capturing_run_flow(flow_id: str, inputs: dict) -> dict:
        call_args_store.append(json.loads(inputs.get("input_value", "{}")))
        return await original_side_effect(flow_id, inputs)

    mock_langflow_client.run_flow.side_effect = capturing_run_flow

    with patch("app.services.recommendations_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_COURSE_RECOMMENDATIONS = "course-recommendations"

        await recommendations_service.get_recommendations(
            sample_session, mock_langflow_client
        )

    assert len(call_args_store) == 1
    passed_inputs = call_args_store[0]
    assert "skill_gaps" in passed_inputs
    assert "Data Engineer" in passed_inputs["target_role"]


@pytest.mark.asyncio
async def test_get_recommendations_fallback_without_langflow(sample_session):
    """When LANGFLOW_BASE_URL is empty, get_recommendations falls back to granite_stub."""
    dummy_client = object()

    with patch("app.services.recommendations_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = ""
        mock_cfg.FLOW_ID_COURSE_RECOMMENDATIONS = ""

        result = await recommendations_service.get_recommendations(
            sample_session, dummy_client  # type: ignore
        )

    assert isinstance(result, RecommendationList)
    assert result.mock is True
    assert len(result.recommendations) > 0
