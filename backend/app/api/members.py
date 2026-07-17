import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_owned_workspace
from app.database import get_db
from app.models import Workspace
from app.schemas.member import InviteRequest, MemberResponse
from app.services import membership as membership_service

router = APIRouter(prefix="/workspaces/{workspace_id}/members")


@router.get("", response_model=list[MemberResponse])
async def list_members(
    workspace: Workspace = Depends(get_owned_workspace),
    db: AsyncSession = Depends(get_db),
):
    return await membership_service.list_members(db, workspace)


@router.post("", response_model=MemberResponse, status_code=status.HTTP_201_CREATED)
async def invite_member(
    data: InviteRequest,
    workspace: Workspace = Depends(get_owned_workspace),
    db: AsyncSession = Depends(get_db),
):
    return await membership_service.invite_member(db, workspace, data)


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_member(
    member_id: uuid.UUID,
    workspace: Workspace = Depends(get_owned_workspace),
    db: AsyncSession = Depends(get_db),
):
    await membership_service.remove_member(db, workspace, member_id)
