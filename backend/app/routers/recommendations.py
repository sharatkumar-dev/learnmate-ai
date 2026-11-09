from fastapi import APIRouter, Header, Request

from app.models.recommendations import RecommendationList
from app.services import recommendations_service

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.post("", response_model=RecommendationList, response_model_by_alias=True)
async def get_recommendations(
    request: Request,
    x_session_id: str = Header(..., alias="X-Session-ID"),
):
    langflow_client = request.app.state.langflow_client
    return await recommendations_service.get_recommendations(x_session_id, langflow_client)
