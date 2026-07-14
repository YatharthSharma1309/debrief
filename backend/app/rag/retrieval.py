from dataclasses import dataclass
from uuid import UUID


@dataclass
class RetrievedChunk:
    chunk_id: UUID
    document_id: UUID
    filename: str
    chunk_index: int
    page_number: int | None
    content: str
    score: float
