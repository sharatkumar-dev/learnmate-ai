from pydantic import BaseModel, Field


class ProgressState(BaseModel):
    milestones: list[str] = []  # all milestone IDs
    completed: list[str] = []   # completed milestone IDs


class ProgressSummary(BaseModel):
    narrative: str
    completion_pct: float
    next_steps: list[str]
    mock: bool = Field(False, serialization_alias="_mock")

    model_config = {"populate_by_name": True}
