from fastapi import APIRouter, Header, Request

from app.models.requests import AnalyzeSkillsRequest
from app.models.skills import SkillGapReport
from app.services import skills_service

router = APIRouter(prefix="/skills", tags=["skills"])


@router.post("/analyze", response_model=SkillGapReport, response_model_by_alias=True)
async def analyze_skills(
    body: AnalyzeSkillsRequest,
    request: Request,
    x_session_id: str = Header(..., alias="X-Session-ID"),
):
    langflow_client = request.app.state.langflow_client
    return await skills_service.analyze_gaps(x_session_id, body, langflow_client)
