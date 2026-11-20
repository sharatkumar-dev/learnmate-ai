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


def get_or_create_session(session_id: str | None = None, profile=None) -> SessionState:
    if session_id and session_id in _sessions:
        return _sessions[session_id]
    sid = session_id or str(uuid.uuid4())
    session = SessionState(session_id=sid, profile=profile)
    _sessions[sid] = session
    return session


def update_session(session_id: str, **kwargs) -> SessionState:
    session = get_session(session_id)
    updated = session.model_copy(update=kwargs)
    _sessions[session_id] = updated
    return updated
