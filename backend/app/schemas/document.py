import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class DocumentStatusEnum(str, Enum):
    pending = "pending"
    processing = "processing"
    ready = "ready"
    failed = "failed"


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    workspace_id: uuid.UUID
    filename: str
    file_type: str
    file_size: int
    status: DocumentStatusEnum
    error_message: str | None
    created_at: datetime
    updated_at: datetime
