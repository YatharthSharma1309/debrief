import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.embeddings.openai_embeddings import embed_texts
from app.models import Document, DocumentChunk
from app.rag.retrieval import RetrievedChunk


async def retrieve_relevant_chunks(
    db: AsyncSession,
    workspace_id: uuid.UUID,
    query: str,
    top_k: int = 5,
) -> list[RetrievedChunk]:
    query_embedding = (await embed_texts([query]))[0]

    distance = DocumentChunk.embedding.cosine_distance(query_embedding)
    stmt = (
        select(
            DocumentChunk,
            Document.filename,
            distance.label("distance"),
        )
        .join(Document, Document.id == DocumentChunk.document_id)
        .where(
            DocumentChunk.workspace_id == workspace_id,
            DocumentChunk.embedding.is_not(None),
        )
        .order_by(distance)
        .limit(top_k)
    )

    result = await db.execute(stmt)
    rows = result.all()

    chunks: list[RetrievedChunk] = []
    for chunk, filename, dist in rows:
        score = float(1 - dist)
        if score < settings.rag_min_score:
            continue
        chunks.append(
            RetrievedChunk(
                chunk_id=chunk.id,
                document_id=chunk.document_id,
                filename=filename,
                chunk_index=chunk.chunk_index,
                page_number=chunk.page_number,
                content=chunk.content,
                score=score,
            )
        )
    return chunks
