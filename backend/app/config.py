from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Debrief"
    debug: bool = False
    api_prefix: str = "/api"

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/contextai"

    # Prefer OpenRouter (OpenAI-compatible). OPENAI_API_KEY remains a fallback alias.
    openrouter_api_key: str = ""
    openai_api_key: str = ""
    llm_base_url: str = "https://openrouter.ai/api/v1"
    llm_chat_model: str = "openrouter/free"
    llm_embedding_model: str = "nvidia/llama-nemotron-embed-vl-1b-v2:free"
    embedding_dimensions: int = 2048
    # Legacy env aliases (optional overrides)
    openai_embedding_model: str | None = None
    openai_chat_model: str | None = None

    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7

    cors_origins: list[str] = ["http://localhost:5173"]
    frontend_url: str = ""

    upload_dir: str = "uploads"
    max_upload_size_mb: int = 10
    chunk_size: int = 1000
    chunk_overlap: int = 200
    allowed_file_types: list[str] = ["pdf", "docx", "txt"]

    rag_top_k: int = 5
    rag_min_score: float = 0.15
    chat_history_limit: int = 10

    @field_validator("debug", mode="before")
    @classmethod
    def normalize_debug(cls, value):
        if isinstance(value, str) and value.strip().lower() in {"release", "prod", "production"}:
            return False
        return value

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        if value.startswith("postgres://"):
            value = value.replace("postgres://", "postgresql+asyncpg://", 1)
        elif value.startswith("postgresql://") and "+asyncpg" not in value:
            value = value.replace("postgresql://", "postgresql+asyncpg://", 1)
        # asyncpg rejects libpq sslmode; Neon/pooler URLs often ship it
        value = value.replace("sslmode=require", "ssl=require")
        value = value.replace("channel_binding=require&", "").replace("&channel_binding=require", "")
        value = value.replace("?channel_binding=require", "")
        return value

    @model_validator(mode="after")
    def append_frontend_cors(self):
        if self.frontend_url and self.frontend_url not in self.cors_origins:
            self.cors_origins = [*self.cors_origins, self.frontend_url]
        return self

    @model_validator(mode="after")
    def apply_legacy_model_aliases(self):
        if self.openai_chat_model:
            self.llm_chat_model = self.openai_chat_model
        if self.openai_embedding_model:
            self.llm_embedding_model = self.openai_embedding_model
        return self


settings = Settings()
