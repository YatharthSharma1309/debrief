from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_owned_workspace
from app.database import get_db
from app.models import Workspace
from app.schemas.summary import SuggestedQuestionsResponse, WorkspaceSummaryResponse
from app.services import summary as summary_service

router = APIRouter(prefix="/workspaces/{workspace_id}")


@router.post("/summary", response_model=WorkspaceSummaryResponse)
async def create_workspace_summary(
    workspace: Workspace = Depends(get_owned_workspace),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await summary_service.generate_workspace_summary(db, workspace.id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/suggested-questions", response_model=SuggestedQuestionsResponse)
async def get_suggested_questions(
    workspace: Workspace = Depends(get_owned_workspace),
    db: AsyncSession = Depends(get_db),
):
    return await summary_service.generate_suggested_questions(db, workspace.id)
