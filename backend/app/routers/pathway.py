from fastapi import APIRouter, Header, Request

from app.models.pathway import Pathway
from app.models.requests import AdaptPathwayRequest, GeneratePathwayRequest
from app.services import pathway_service

router = APIRouter(prefix="/pathway", tags=["pathway"])


@router.post("/generate", response_model=Pathway, response_model_by_alias=True)
async def generate_pathway(
    body: GeneratePathwayRequest,
    request: Request,
    x_session_id: str = Header(..., alias="X-Session-ID"),
):
    langflow_client = request.app.state.langflow_client
    return await pathway_service.generate_pathway(x_session_id, body, langflow_client)


@router.post("/adapt", response_model=Pathway, response_model_by_alias=True)
async def adapt_pathway(
    body: AdaptPathwayRequest,
    request: Request,
    x_session_id: str = Header(..., alias="X-Session-ID"),
):
    langflow_client = request.app.state.langflow_client
    return await pathway_service.adapt_pathway(x_session_id, body, langflow_client)
