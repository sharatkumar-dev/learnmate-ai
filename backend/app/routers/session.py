from fastapi import APIRouter, Response

from app.core.session import create_session, get_session
from app.models.requests import StartSessionRequest
from app.models.session import SessionState

router = APIRouter(prefix="/session", tags=["session"])


@router.post("/start")
def start_session(body: StartSessionRequest = StartSessionRequest(), response: Response = None):
    session = create_session(profile=body.profile)
    response.headers["X-Session-ID"] = session.session_id
    return {"session_id": session.session_id, "message": "Session created successfully"}


@router.get("/{session_id}", response_model=SessionState)
def get_session_state(session_id: str):
    return get_session(session_id)
