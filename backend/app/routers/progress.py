from fastapi import APIRouter, Header, Request

from app.models.progress import ProgressState, ProgressSummary
from app.models.requests import UpdateProgressRequest
from app.services import progress_service

router = APIRouter(prefix="/progress", tags=["progress"])


@router.post("/update", response_model=ProgressState)
async def update_progress(
    body: UpdateProgressRequest,
    x_session_id: str = Header(..., alias="X-Session-ID"),
):
    return await progress_service.update_progress(x_session_id, body.milestone_id)


@router.get("/summary", response_model=ProgressSummary, response_model_by_alias=True)
async def get_progress_summary(
    request: Request,
    x_session_id: str = Header(..., alias="X-Session-ID"),
):
    langflow_client = request.app.state.langflow_client
    return await progress_service.get_summary(x_session_id, langflow_client)
