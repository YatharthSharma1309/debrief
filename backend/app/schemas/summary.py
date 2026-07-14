from datetime import datetime

from pydantic import BaseModel, Field


class WorkspaceSummaryResponse(BaseModel):
    overview: str
    key_decisions: list[str] = Field(default_factory=list)
    open_questions: list[str] = Field(default_factory=list)
    risks: list[str] = Field(default_factory=list)
    important_dates: list[str] = Field(default_factory=list)
    action_items: list[str] = Field(default_factory=list)
    suggested_questions: list[str] = Field(default_factory=list)
    generated_at: datetime | None = None


class SuggestedQuestionsResponse(BaseModel):
    questions: list[str]
