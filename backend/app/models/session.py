from pydantic import BaseModel

from app.models.learner import LearnerProfile
from app.models.pathway import Pathway
from app.models.skills import SkillGapReport
from app.models.recommendations import RecommendationList
from app.models.progress import ProgressState
from app.models.chat import ChatMessage


class SessionState(BaseModel):
    session_id: str
    profile: LearnerProfile | None = None
    pathway: Pathway | None = None
    skill_gaps: SkillGapReport | None = None
    recommendations: RecommendationList | None = None
    progress: ProgressState = ProgressState()
    chat_history: list[ChatMessage] = []
