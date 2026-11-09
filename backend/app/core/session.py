import uuid

from fastapi import HTTPException

from app.models.session import SessionState

_sessions: dict[str, SessionState] = {}


def create_session(profile=None) -> SessionState:
    session_id = str(uuid.uuid4())
    session = SessionState(session_id=session_id, profile=profile)
    _sessions[session_id] = session
    return session


def get_session(session_id: str) -> SessionState:
    session = _sessions.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail=f"Session '{session_id}' not found")
    return session


def update_session(session_id: str, **kwargs) -> SessionState:
    session = get_session(session_id)
    updated = session.model_copy(update=kwargs)
    _sessions[session_id] = updated
    return updated
