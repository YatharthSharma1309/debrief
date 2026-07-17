import uuid

from pydantic import BaseModel, Field


class SearchHit(BaseModel):
    chunk_id: uuid.UUID
    document_id: uuid.UUID
    workspace_id: uuid.UUID
    workspace_name: str
    filename: str
    chunk_index: int
    page_number: int | None
    content: str
    score: float


class SearchResponse(BaseModel):
    query: str
    hits: list[SearchHit] = Field(default_factory=list)
