from pydantic import BaseModel

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


class ChatRequest(BaseModel):
    message: str
