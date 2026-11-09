from fastapi import APIRouter, Header, Request

from app.models.chat import ChatResponse
from app.models.requests import ChatRequest
from app.services import companion_service

router = APIRouter(prefix="/companion", tags=["companion"])


@router.post("/chat", response_model=ChatResponse, response_model_by_alias=True)
async def companion_chat(
    body: ChatRequest,
    request: Request,
    x_session_id: str = Header(..., alias="X-Session-ID"),
):
    langflow_client = request.app.state.langflow_client
    return await companion_service.chat(x_session_id, body.message, langflow_client)
