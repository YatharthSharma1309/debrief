import uuid

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import User, Workspace, WorkspaceMember, WorkspaceRole
from app.schemas.member import InviteRequest, MemberResponse, WorkspaceRoleEnum


def _to_response(member: WorkspaceMember) -> MemberResponse:
    return MemberResponse(
        id=member.id,
        workspace_id=member.workspace_id,
        user_id=member.user_id,
        email=member.user.email,
        full_name=member.user.full_name,
        role=WorkspaceRoleEnum(member.role.value),
        created_at=member.created_at,
    )


async def list_members(db: AsyncSession, workspace: Workspace) -> list[MemberResponse]:
    result = await db.execute(
        select(WorkspaceMember)
        .where(WorkspaceMember.workspace_id == workspace.id)
        .options(selectinload(WorkspaceMember.user))
        .order_by(WorkspaceMember.created_at.asc())
    )
    members = list(result.scalars().all())
    return [_to_response(m) for m in members]


async def invite_member(
    db: AsyncSession,
    workspace: Workspace,
    data: InviteRequest,
) -> MemberResponse:
    email = data.email.lower().strip()
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.id == workspace.user_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Owner is already part of the workspace",
        )

    existing = await db.execute(
        select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace.id,
            WorkspaceMember.user_id == user.id,
        )
    )
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already a member",
        )

    member = WorkspaceMember(
        workspace_id=workspace.id,
        user_id=user.id,
        role=WorkspaceRole(data.role.value),
    )
    db.add(member)
    await db.commit()
    result = await db.execute(
        select(WorkspaceMember)
        .where(WorkspaceMember.id == member.id)
        .options(selectinload(WorkspaceMember.user))
    )
    member = result.scalar_one()
    return _to_response(member)


async def remove_member(
    db: AsyncSession,
    workspace: Workspace,
    member_id: uuid.UUID,
) -> None:
    result = await db.execute(
        select(WorkspaceMember).where(
            WorkspaceMember.id == member_id,
            WorkspaceMember.workspace_id == workspace.id,
        )
    )
    member = result.scalar_one_or_none()
    if member is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
    await db.delete(member)
    await db.commit()
