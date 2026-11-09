"""
test_companion_service.py — Happy-path tests for companion_service.
"""

from __future__ import annotations

from unittest.mock import patch

import pytest

from app.core.session import get_session
from app.models.chat import ChatResponse
from app.services import companion_service


@pytest.mark.asyncio
async def test_chat_returns_response(mock_langflow_client, sample_session):
    """chat() should return a ChatResponse with a non-empty response string."""
    with patch("app.services.companion_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_LEARNING_COMPANION = "learning-companion"

        result = await companion_service.chat(
            sample_session, "How do I get started?", mock_langflow_client
        )

    assert isinstance(result, ChatResponse)
    assert len(result.response) > 0
    assert result.mock is True


@pytest.mark.asyncio
async def test_chat_appends_to_history(mock_langflow_client, sample_session):
    """chat() should append both user and assistant messages to chat_history."""
    initial_session = get_session(sample_session)
    initial_len = len(initial_session.chat_history)

    with patch("app.services.companion_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_LEARNING_COMPANION = "learning-companion"

        await companion_service.chat(
            sample_session, "What should I learn next?", mock_langflow_client
        )

    updated_session = get_session(sample_session)
    assert len(updated_session.chat_history) == initial_len + 2


@pytest.mark.asyncio
async def test_chat_history_roles(mock_langflow_client, sample_session):
    """chat_history should contain a 'user' message followed by an 'assistant' message."""
    with patch("app.services.companion_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_LEARNING_COMPANION = "learning-companion"

        await companion_service.chat(
            sample_session, "Explain machine learning to me.", mock_langflow_client
        )

    session = get_session(sample_session)
    last_two = session.chat_history[-2:]
    assert last_two[0].role == "user"
    assert last_two[0].content == "Explain machine learning to me."
    assert last_two[1].role == "assistant"
    assert len(last_two[1].content) > 0


@pytest.mark.asyncio
async def test_chat_accumulates_history(mock_langflow_client, sample_session):
    """Multiple chat() calls should accumulate messages in history."""
    with patch("app.services.companion_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_LEARNING_COMPANION = "learning-companion"

        await companion_service.chat(
            sample_session, "First message", mock_langflow_client
        )
        await companion_service.chat(
            sample_session, "Second message", mock_langflow_client
        )

    session = get_session(sample_session)
    assert len(session.chat_history) >= 4  # 2 messages × 2 turns


@pytest.mark.asyncio
async def test_chat_fallback_without_langflow(sample_session):
    """When LANGFLOW_BASE_URL is empty, chat falls back to granite_stub."""
    dummy_client = object()

    with patch("app.services.companion_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = ""
        mock_cfg.FLOW_ID_LEARNING_COMPANION = ""

        result = await companion_service.chat(
            sample_session, "What is deep learning?", dummy_client  # type: ignore
        )

    assert isinstance(result, ChatResponse)
    assert result.mock is True
    assert len(result.response) > 0


@pytest.mark.asyncio
async def test_chat_includes_suggested_actions(mock_langflow_client, sample_session):
    """chat() should return suggested_actions from the AI response."""
    with patch("app.services.companion_service.config") as mock_cfg:
        mock_cfg.LANGFLOW_BASE_URL = "http://langflow:7860"
        mock_cfg.FLOW_ID_LEARNING_COMPANION = "learning-companion"

        result = await companion_service.chat(
            sample_session, "Any tips?", mock_langflow_client
        )

    assert isinstance(result.suggested_actions, list)
    assert len(result.suggested_actions) > 0
