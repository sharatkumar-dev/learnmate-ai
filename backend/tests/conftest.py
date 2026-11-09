"""
conftest.py — Shared pytest fixtures for LearnMate AI backend tests.
"""

from __future__ import annotations

import json
import pytest

from unittest.mock import AsyncMock

from app.clients.langflow import LangflowClient
from app.core import session as session_store
from app.core.session import create_session, update_session
from app.models.learner import LearnerProfile
from app.models.skills import SkillGap, SkillGapReport
from app.services.granite_stub import run_stub


def _make_langflow_envelope(data: dict) -> dict:
    """Wrap a response dict in a Langflow v1 response envelope."""
    return {
        "outputs": [
            {
                "outputs": [
                    {
                        "results": {
                            "message": {
                                "text": json.dumps(data)
                            }
                        }
                    }
                ]
            }
        ]
    }


@pytest.fixture
def sample_profile() -> LearnerProfile:
    return LearnerProfile(
        target_role="Data Engineer",
        current_skills=["Python", "SQL"],
        interests=["Machine Learning"],
        time_available_hours_per_week=10.0,
    )


@pytest.fixture
def sample_session(sample_profile: LearnerProfile) -> str:
    """Create a real in-memory session and return its session_id."""
    state = create_session(profile=sample_profile)
    # Also seed skill_gaps so recommendations service can read them
    report = SkillGapReport(
        gaps=[
            SkillGap(
                skill="Core Data Engineer domain knowledge",
                priority="high",
                rationale="Required for the role.",
            ),
            SkillGap(
                skill="Data Engineer tooling and workflow",
                priority="medium",
                rationale="Day-to-day tooling.",
            ),
        ],
        target_role="Data Engineer",
        mock=True,
    )
    update_session(state.session_id, skill_gaps=report)
    return state.session_id


@pytest.fixture
def mock_langflow_client(sample_profile: LearnerProfile) -> LangflowClient:
    """AsyncMock LangflowClient whose run_flow returns a Langflow-envelope-wrapped
    granite_stub response for the given inputs."""

    client = AsyncMock(spec=LangflowClient)

    async def _run_flow(flow_id: str, inputs: dict) -> dict:
        # Determine flow type from the flow_id string (tests use descriptive IDs)
        flow_type_map = {
            "pathway-generation": "pathway-generation",
            "adaptive-update": "adaptive-update",
            "skill-gap-analysis": "skill-gap-analysis",
            "course-recommendations": "course-recommendations",
            "progress-summary": "progress-summary",
            "learning-companion": "learning-companion",
        }
        # flow_id in tests is the flow type slug itself
        flow_type = flow_type_map.get(flow_id, flow_id)
        # Decode the embedded JSON inputs
        raw_inputs: dict = {}
        if "input_value" in inputs:
            try:
                raw_inputs = json.loads(inputs["input_value"])
            except (json.JSONDecodeError, TypeError):
                raw_inputs = inputs
        stub_result = await run_stub(flow_type, raw_inputs)
        return _make_langflow_envelope(stub_result)

    client.run_flow.side_effect = _run_flow
    return client
