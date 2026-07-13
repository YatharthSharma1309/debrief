# ContextAI Architecture

## Overview

ContextAI is a RAG-powered document workspace. Users upload documents into workspaces, and the system chunks, embeds, and indexes content in PostgreSQL using pgvector. Chat queries retrieve relevant chunks and stream cited answers via the OpenAI API.

## Why PostgreSQL + pgvector?

We chose **PostgreSQL + pgvector** over dedicated vector databases (ChromaDB, Qdrant) because:

- **Single database** — Users, workspaces, documents, chunks, and embeddings live in one system
- **Production-ready** — Battle-tested at scale; easy to deploy on Supabase, Neon, or Railway
- **Transactional consistency** — Document metadata and vectors stay in sync
- **Familiar ops** — Standard SQL, migrations (Alembic), backups, and monitoring

## System components

### Frontend (`frontend/`)

| Directory | Purpose |
|-----------|---------|
| `components/` | Reusable UI components |
| `pages/` | Route-level page components |
| `hooks/` | Custom React hooks (TanStack Query wrappers) |
| `services/` | API client functions |
| `stores/` | Zustand global state |

### Backend (`backend/app/`)

| Directory | Purpose |
|-----------|---------|
| `api/` | FastAPI route handlers |
| `models/` | SQLAlchemy ORM models |
| `services/` | Business logic (auth, workspaces, documents) |
| `rag/` | Retrieval-augmented generation pipeline |
| `embeddings/` | OpenAI embedding generation |
| `prompts/` | System and user prompt templates |

## Data flow

### Document ingestion

1. User uploads file via REST API
2. Backend parses document (PDF, DOCX, TXT, etc.)
3. Text is chunked with overlap
4. Chunks are embedded via OpenAI Embeddings API
5. Vectors stored in `document_chunks` table (pgvector column)
6. Metadata stored alongside chunks for citation

### Chat / RAG query

1. User sends message in workspace chat
2. Query is embedded
3. pgvector similarity search retrieves top-k chunks
4. Chunks injected into prompt context
5. OpenAI chat completion streams response
6. Citations reference source document + chunk

## Planned database schema (Phase 2)

```text
users
  └── workspaces
        ├── documents
        │     └── document_chunks (embedding vector)
        └── chat_sessions
              └── chat_messages
```

## API design

- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — JWT token
- `GET/POST /api/workspaces` — List/create workspaces
- `POST /api/workspaces/{id}/documents` — Upload document
- `POST /api/workspaces/{id}/chat` — Stream chat (SSE)

## Security

- JWT bearer authentication
- Workspace-level authorization (users only access their workspaces)
- File type validation and size limits
- API keys stored in environment variables only

## Deployment target

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Railway or Render |
| Database | Supabase PostgreSQL (pgvector enabled) |
