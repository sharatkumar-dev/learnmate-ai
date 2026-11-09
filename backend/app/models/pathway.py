from pydantic import BaseModel, Field


class Milestone(BaseModel):
    id: str
    title: str
    description: str
    resources: list[str]
    order: int
    completed: bool = False


class Pathway(BaseModel):
    milestones: list[Milestone]
    estimated_duration_weeks: int
    target_role: str
    mock: bool = Field(False, serialization_alias="_mock")

    model_config = {"populate_by_name": True}
