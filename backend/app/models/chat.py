from typing import Literal
from pydantic import BaseModel, Field

ChatRole = Literal["user", "assistant"]


class ChatMessage(BaseModel):
    role: ChatRole
    content: str
    timestamp: str  # ISO 8601
    mode: str | None = None
    citations: list[str] = []


class ChatResponse(BaseModel):
    response: str
    suggested_actions: list[str] = []
    mock: bool = Field(False, serialization_alias="_mock")
    model_used: str | None = None
    citations: list[str] = []
    conversation_id: str | None = None

    model_config = {"populate_by_name": True}
