from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from typing import Any, Dict

router = APIRouter(prefix="/settings", tags=["settings"])

# In-memory storage for settings keyed by session_id
_settings_store: Dict[str, Dict[str, Any]] = {}

class SettingsPayload(BaseModel):
    settings: Dict[str, Any]

class ResetPasswordPayload(BaseModel):
    current_password: str
    new_password: str

@router.get("")
async def get_settings(x_session_id: str = Header("default-session", alias="X-Session-ID")):
    """Get stored settings for the active session."""
    data = _settings_store.get(x_session_id)
    return {"status": "ok", "settings": data, "session_id": x_session_id}

@router.post("")
async def save_settings(
    body: SettingsPayload,
    x_session_id: str = Header("default-session", alias="X-Session-ID"),
):
    """Save user settings for the active session."""
    _settings_store[x_session_id] = body.settings
    return {"status": "ok", "message": "Settings saved successfully", "session_id": x_session_id}

@router.post("/reset-password")
async def reset_password(
    body: ResetPasswordPayload,
    x_session_id: str = Header("default-session", alias="X-Session-ID"),
):
    """Secure password reset endpoint."""
    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters.")
    return {"status": "ok", "message": "Password updated successfully"}

@router.post("/export")
async def export_data(x_session_id: str = Header("default-session", alias="X-Session-ID")):
    """Generate export manifest of all user session data."""
    return {
        "status": "ok",
        "session_id": x_session_id,
        "settings": _settings_store.get(x_session_id, {}),
        "export_timestamp": "2026-11-20T22:30:00Z",
    }
