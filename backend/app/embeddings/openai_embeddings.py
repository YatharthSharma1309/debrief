from openai import AsyncOpenAI

from app.config import settings

BATCH_SIZE = 100


async def embed_texts(texts: list[str]) -> list[list[float]]:
    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY is not configured")

    client = AsyncOpenAI(api_key=settings.openai_api_key)
    embeddings: list[list[float]] = []

    for start in range(0, len(texts), BATCH_SIZE):
        batch = texts[start : start + BATCH_SIZE]
        response = await client.embeddings.create(
            model=settings.openai_embedding_model,
            input=batch,
        )
        embeddings.extend(item.embedding for item in response.data)

    return embeddings
