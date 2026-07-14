from openai import AsyncOpenAI

from app.config import settings

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"


def get_llm_api_key() -> str:
    return (settings.openrouter_api_key or settings.openai_api_key or "").strip()


def get_llm_client() -> AsyncOpenAI:
    api_key = get_llm_api_key()
    if not api_key:
        raise ValueError(
            "OPENROUTER_API_KEY is not configured (OPENAI_API_KEY is also accepted as a fallback)"
        )

    headers = {
        "HTTP-Referer": settings.frontend_url or "https://github.com/YatharthSharma1309/debrief",
        "X-Title": settings.app_name or "Debrief",
    }
    return AsyncOpenAI(
        api_key=api_key,
        base_url=settings.llm_base_url or OPENROUTER_BASE_URL,
        default_headers=headers,
    )
