from pydantic import BaseModel, Field
from app.models.learner import LearnerProfile


class StartSessionRequest(BaseModel):
    profile: LearnerProfile | None = None


class GeneratePathwayRequest(BaseModel):
    profile: LearnerProfile


class AdaptPathwayRequest(BaseModel):
    feedback: str
    completed_milestone_ids: list[str] = []


class AnalyzeSkillsRequest(BaseModel):
    current_skills: list[str]
    target_role: str


class UpdateProgressRequest(BaseModel):
    milestone_id: str


class ChatAttachment(BaseModel):
    filename: str
    file_type: str = "text"
    file_size: int = 0
    text_content: str = ""


class ChatRequest(BaseModel):
    message: str
    cognitive_mode: str = "socratic"  # "socratic" | "code" | "direct"
    conversation_id: str | None = None
    attachments: list[ChatAttachment] = []
    context: dict | None = None


class FeedbackRequest(BaseModel):
    message_id: str
    rating: str  # "up" | "down"
    feedback_text: str | None = None
