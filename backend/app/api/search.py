from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models import User
from app.rag.search import retrieve_relevant_chunks_multi
from app.schemas.search import SearchHit, SearchResponse
from app.services import workspace as workspace_service

router = APIRouter()


@router.get("/search", response_model=SearchResponse)
async def search(
    q: str = Query(min_length=1),
    top_k: int = Query(default=5, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workspaces = await workspace_service.list_workspaces(db, current_user)
    workspace_ids = [ws.id for ws in workspaces]
    chunks = await retrieve_relevant_chunks_multi(db, workspace_ids, q.strip(), top_k=top_k)
    hits = [
        SearchHit(
            chunk_id=chunk.chunk_id,
            document_id=chunk.document_id,
            workspace_id=chunk.workspace_id,
            workspace_name=chunk.workspace_name or "",
            filename=chunk.filename,
            chunk_index=chunk.chunk_index,
            page_number=chunk.page_number,
            content=chunk.content,
            score=chunk.score,
        )
        for chunk in chunks
        if chunk.workspace_id is not None
    ]
    return SearchResponse(query=q.strip(), hits=hits)
