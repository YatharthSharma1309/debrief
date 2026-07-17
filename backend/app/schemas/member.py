import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr


class WorkspaceRoleEnum(str, Enum):
    editor = "editor"
    viewer = "viewer"


class InviteRequest(BaseModel):
    email: EmailStr
    role: WorkspaceRoleEnum = WorkspaceRoleEnum.viewer


class MemberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    workspace_id: uuid.UUID
    user_id: uuid.UUID
    email: str
    full_name: str | None = None
    role: WorkspaceRoleEnum
    created_at: datetime
