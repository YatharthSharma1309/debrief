from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Debrief"
    debug: bool = False
    api_prefix: str = "/api"

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/contextai"

    openai_api_key: str = ""
    openai_embedding_model: str = "text-embedding-3-small"
    openai_chat_model: str = "gpt-5.6-terra"

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
    rag_min_score: float = 0.3
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
        return value

    @model_validator(mode="after")
    def append_frontend_cors(self):
        if self.frontend_url and self.frontend_url not in self.cors_origins:
            self.cors_origins = [*self.cors_origins, self.frontend_url]
        return self


settings = Settings()
