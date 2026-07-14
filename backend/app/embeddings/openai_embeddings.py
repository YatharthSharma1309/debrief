from app.config import settings
from app.llm.client import get_llm_client

BATCH_SIZE = 64


async def embed_texts(texts: list[str]) -> list[list[float]]:
    client = get_llm_client()
    embeddings: list[list[float]] = []

    for start in range(0, len(texts), BATCH_SIZE):
        batch = texts[start : start + BATCH_SIZE]
        response = await client.embeddings.create(
            model=settings.llm_embedding_model,
            input=batch,
            encoding_format="float",
        )
        vectors = [item.embedding for item in response.data]
        if vectors and len(vectors[0]) != settings.embedding_dimensions:
            raise ValueError(
                f"Embedding dim mismatch: got {len(vectors[0])}, "
                f"expected {settings.embedding_dimensions}. "
                "Update EMBEDDING_DIMENSIONS / run migrations."
            )
        embeddings.extend(vectors)

    return embeddings
