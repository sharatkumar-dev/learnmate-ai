"""
companion_service — AI-powered conversational learning companion.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone

from fastapi import HTTPException

from app.clients.langflow import LangflowClient
from app.core import config
from app.core.session import get_session, update_session
from app.models.chat import ChatMessage, ChatResponse
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


async def chat(
    session_id: str,
    message: str,
    langflow_client: LangflowClient,
) -> ChatResponse:
    """Send a message to the AI learning companion and get a response."""
    session = get_session(session_id)

    # Build session context from current state
    profile = session.profile
    context: dict = {
        "target_role": profile.target_role if profile else "",
        "current_skills": profile.current_skills if profile else [],
        "pathway_stage": len(session.progress.completed),
        "recent_chat": [
            {"role": m.role, "content": m.content}
            for m in session.chat_history[-3:]
        ],
    }

    inputs = {
        "message": message,
        "session_context": context,
    }
    data = await _call_flow_or_stub(
        config.FLOW_ID_LEARNING_COMPANION,
        "learning-companion",
        inputs,
        langflow_client,
    )

    response = ChatResponse(
        response=data.get("response", ""),
        suggested_actions=data.get("suggested_actions", []),
        mock=data.get("_mock", False),
    )

    # Append user and assistant messages to chat history
    now = datetime.now(timezone.utc).isoformat()
    user_msg = ChatMessage(role="user", content=message, timestamp=now)
    assistant_msg = ChatMessage(
        role="assistant", content=response.response, timestamp=now
    )
    new_history = session.chat_history + [user_msg, assistant_msg]
    update_session(session_id, chat_history=new_history)

    return response
