import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_accessible_workspace, get_current_user
from app.database import get_db
from app.models import ChatSession, User, Workspace
from app.schemas.chat import (
    ChatMessageResponse,
    ChatSessionCreate,
    ChatSessionResponse,
    SendMessageRequest,
)
from app.services import chat as chat_service

router = APIRouter(prefix="/workspaces/{workspace_id}/chat")


async def get_owned_session(
    session_id: uuid.UUID,
    workspace: Workspace = Depends(get_accessible_workspace),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChatSession:
    session = await chat_service.get_session(db, workspace, current_user, session_id)
    if session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found")
    return session


@router.get("/sessions", response_model=list[ChatSessionResponse])
async def list_chat_sessions(
    workspace: Workspace = Depends(get_accessible_workspace),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await chat_service.list_sessions(db, workspace, current_user)


@router.post("/sessions", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_chat_session(
    data: ChatSessionCreate,
    workspace: Workspace = Depends(get_accessible_workspace),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await chat_service.create_session(db, workspace, current_user, data.title)


@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageResponse])
async def list_chat_messages(
    session: ChatSession = Depends(get_owned_session),
    db: AsyncSession = Depends(get_db),
):
    return await chat_service.list_messages(db, session)


@router.post("/sessions/{session_id}/messages")
async def send_chat_message(
    data: SendMessageRequest,
    session: ChatSession = Depends(get_owned_session),
    workspace: Workspace = Depends(get_accessible_workspace),
    db: AsyncSession = Depends(get_db),
):
    return StreamingResponse(
        chat_service.stream_chat_response(db, workspace, session, data.content.strip()),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
