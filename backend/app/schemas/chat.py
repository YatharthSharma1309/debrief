import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class MessageRoleEnum(str, Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class Citation(BaseModel):
    document_id: uuid.UUID
    filename: str
    chunk_index: int
    page_number: int | None = None
    excerpt: str
    score: float | None = None


class ChatSessionCreate(BaseModel):
    title: str | None = Field(default=None, max_length=255)


class ChatSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    workspace_id: uuid.UUID
    user_id: uuid.UUID
    title: str | None
    created_at: datetime
    updated_at: datetime


class ChatMessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    session_id: uuid.UUID
    role: MessageRoleEnum
    content: str
    citations: list[Citation] | None
    created_at: datetime


class SendMessageRequest(BaseModel):
    content: str = Field(min_length=1, max_length=8000)
