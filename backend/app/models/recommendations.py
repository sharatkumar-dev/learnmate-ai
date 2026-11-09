from typing import Literal

from pydantic import BaseModel, Field

ResourceType = Literal["course", "tutorial", "book", "video", "article"]


class Recommendation(BaseModel):
    title: str
    url: str
    type: ResourceType
    duration: str
    skill: str


class RecommendationList(BaseModel):
    recommendations: list[Recommendation]
    mock: bool = Field(False, serialization_alias="_mock")

    model_config = {"populate_by_name": True}
