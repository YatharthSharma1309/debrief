from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, field_validator


class BriefSource(BaseModel):
    filename: str
    page_number: int | None = None


class DecisionItem(BaseModel):
    text: str
    rationale: str | None = None
    owner: str | None = None
    confidence: str | None = None
    sources: list[BriefSource] = Field(default_factory=list)


class QuestionItem(BaseModel):
    text: str
    owner: str | None = None
    sources: list[BriefSource] = Field(default_factory=list)


class RiskItem(BaseModel):
    text: str
    severity: str | None = None
    risk_type: str | None = Field(default=None, alias="type", serialization_alias="type")
    sources: list[BriefSource] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


class DateItem(BaseModel):
    label: str
    date: str | None = None
    conflict_with: str | None = None
    sources: list[BriefSource] = Field(default_factory=list)


class ActionItem(BaseModel):
    text: str
    owner: str | None = None
    due_date: str | None = None
    status: str | None = None
    sources: list[BriefSource] = Field(default_factory=list)


class OwnerItem(BaseModel):
    name: str
    owns: list[str] = Field(default_factory=list)


def _coerce_text_items(value: Any, model: type[BaseModel]) -> list[Any]:
    if not value:
        return []
    items: list[Any] = []
    for entry in value:
        if isinstance(entry, str):
            if model is DecisionItem:
                items.append(DecisionItem(text=entry))
            elif model is QuestionItem:
                items.append(QuestionItem(text=entry))
            elif model is RiskItem:
                items.append(RiskItem(text=entry))
            elif model is DateItem:
                items.append(DateItem(label=entry))
            elif model is ActionItem:
                items.append(ActionItem(text=entry))
            else:
                continue
        elif isinstance(entry, dict):
            # Accept either label or text for dates
            if model is DateItem and "label" not in entry and "text" in entry:
                entry = {**entry, "label": entry["text"]}
            if model is RiskItem and "risk_type" not in entry and "type" in entry:
                pass
            items.append(model.model_validate(entry))
        else:
            items.append(entry)
    return items


class WorkspaceSummaryResponse(BaseModel):
    overview: str
    key_decisions: list[DecisionItem] = Field(default_factory=list)
    open_questions: list[QuestionItem] = Field(default_factory=list)
    risks: list[RiskItem] = Field(default_factory=list)
    important_dates: list[DateItem] = Field(default_factory=list)
    action_items: list[ActionItem] = Field(default_factory=list)
    owners: list[OwnerItem] = Field(default_factory=list)
    suggested_questions: list[str] = Field(default_factory=list)
    generated_at: datetime | None = None

    @field_validator("key_decisions", mode="before")
    @classmethod
    def coerce_decisions(cls, value: Any) -> Any:
        return _coerce_text_items(value, DecisionItem)

    @field_validator("open_questions", mode="before")
    @classmethod
    def coerce_questions(cls, value: Any) -> Any:
        return _coerce_text_items(value, QuestionItem)

    @field_validator("risks", mode="before")
    @classmethod
    def coerce_risks(cls, value: Any) -> Any:
        return _coerce_text_items(value, RiskItem)

    @field_validator("important_dates", mode="before")
    @classmethod
    def coerce_dates(cls, value: Any) -> Any:
        return _coerce_text_items(value, DateItem)

    @field_validator("action_items", mode="before")
    @classmethod
    def coerce_actions(cls, value: Any) -> Any:
        return _coerce_text_items(value, ActionItem)


class SuggestedQuestionsResponse(BaseModel):
    questions: list[str]
