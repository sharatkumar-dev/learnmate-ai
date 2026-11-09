from pydantic import BaseModel


class LearnerProfile(BaseModel):
    target_role: str
    current_skills: list[str]
    interests: list[str]
    time_available_hours_per_week: float
