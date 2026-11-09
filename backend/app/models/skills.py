from typing import Literal

from pydantic import BaseModel, Field


class SkillGap(BaseModel):
    skill: str
    priority: Literal["high", "medium", "low"]
    rationale: str


class SkillGapReport(BaseModel):
    gaps: list[SkillGap]
    target_role: str
    mock: bool = Field(False, serialization_alias="_mock")

    model_config = {"populate_by_name": True}
