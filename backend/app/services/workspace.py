import uuid

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User, Workspace, WorkspaceMember
from app.schemas.workspace import WorkspaceCreate, WorkspaceUpdate


async def list_workspaces(db: AsyncSession, user: User) -> list[Workspace]:
    member_workspace_ids = select(WorkspaceMember.workspace_id).where(WorkspaceMember.user_id == user.id)
    result = await db.execute(
        select(Workspace)
        .where(or_(Workspace.user_id == user.id, Workspace.id.in_(member_workspace_ids)))
        .order_by(Workspace.updated_at.desc())
    )
    return list(result.scalars().all())


async def get_workspace(db: AsyncSession, workspace_id: uuid.UUID, user: User) -> Workspace | None:
    result = await db.execute(
        select(Workspace).where(Workspace.id == workspace_id, Workspace.user_id == user.id)
    )
    return result.scalar_one_or_none()


async def get_accessible_workspace(
    db: AsyncSession, workspace_id: uuid.UUID, user: User
) -> Workspace | None:
    member_match = (
        select(WorkspaceMember.id)
        .where(
            WorkspaceMember.workspace_id == Workspace.id,
            WorkspaceMember.user_id == user.id,
        )
        .exists()
    )
    result = await db.execute(
        select(Workspace).where(
            Workspace.id == workspace_id,
            or_(Workspace.user_id == user.id, member_match),
        )
    )
    return result.scalar_one_or_none()


async def create_workspace(db: AsyncSession, user: User, data: WorkspaceCreate) -> Workspace:
    workspace = Workspace(user_id=user.id, name=data.name.strip(), description=data.description)
    db.add(workspace)
    await db.commit()
    await db.refresh(workspace)
    return workspace


async def update_workspace(
    db: AsyncSession, workspace: Workspace, data: WorkspaceUpdate
) -> Workspace:
    if data.name is not None:
        workspace.name = data.name.strip()
    if data.description is not None:
        workspace.description = data.description
    await db.commit()
    await db.refresh(workspace)
    return workspace


async def delete_workspace(db: AsyncSession, workspace: Workspace) -> None:
    await db.delete(workspace)
    await db.commit()
