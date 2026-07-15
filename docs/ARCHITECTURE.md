# Debrief Architecture

## Overview

Debrief recovers **decisions, rationale, owners, risks, open questions, and dates** from documents uploaded into a workspace. The backend parses, chunks, embeds, and indexes content in PostgreSQL with pgvector. Decision Briefs and cited follow-ups retrieve relevant chunks and call OpenRouter models to produce structured, citation-backed outputs.

## Why PostgreSQL + pgvector?

We use PostgreSQL + pgvector because:

- Users, workspaces, documents, chunks, chat history, and embeddings live in one database
- It is straightforward to deploy on Neon, Railway, Render, or similar platforms
- Document metadata and vectors stay transactionally consistent
- Standard SQL, Alembic migrations, backups, and monitoring are familiar

## Components

### Frontend

| Directory | Purpose |
|-----------|---------|
| `components/` | Reusable UI components |
| `pages/` | Route-level page components |
| `hooks/` | TanStack Query wrappers |
| `services/` | API client functions |
| `stores/` | Zustand global state |

### Backend

| Directory | Purpose |
|-----------|---------|
| `api/` | FastAPI route handlers |
| `models/` | SQLAlchemy ORM models |
| `schemas/` | Pydantic request/response schemas |
| `services/` | Auth, workspaces, documents, chat, Decision Briefs |
| `rag/` | Retrieval pipeline |
| `llm/` | OpenRouter client helpers |
| `embeddings/` | Embedding generation via OpenRouter |
| `prompts/` | Decision Brief and RAG prompts |

## Data Flow

### Document Ingestion

1. User uploads a PDF, DOCX, or TXT file
2. Backend validates and stores the file
3. Parser extracts text
4. Chunker splits text with overlap
5. Embeddings are generated via OpenRouter
6. Chunks and embeddings are stored in `document_chunks`
7. Document status changes to `ready`

### Decision Brief

1. User clicks **Generate brief**
2. Backend retrieves representative chunks from the workspace
3. The chat model returns structured JSON (see `app/schemas/summary.py`):
   - `overview`
   - `key_decisions` — text, rationale, owner, confidence, sources
   - `open_questions` — text, owner, sources
   - `risks` — text, severity, type, sources
   - `important_dates` — label, date, conflict_with, sources
   - `action_items` — text, owner, due_date, status, sources
   - `owners` — name + owned areas
   - `suggested_questions`
4. Frontend renders the **Decision Brief** (ask-from-row, source jump, stale badge when docs change after `generated_at`)

### Cited Follow-ups

1. User asks a question (or clicks Ask on a brief row)
2. Query is embedded
3. pgvector retrieves the most relevant chunks
4. The chat model streams an answer using only retrieved context
5. Response includes citations with source document, excerpt, page when available, and relevance score

## Security

- JWT bearer authentication
- Workspace-level authorization
- File type validation
- Upload size limits
- Environment-only API keys and secrets

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Railway (or Render) |
| Database | Neon PostgreSQL + pgvector |
| AI runtime | OpenRouter free models |

## Related

- Competitive positioning: [COMPETITIVE_LANDSCAPE.md](COMPETITIVE_LANDSCAPE.md)
- Diagrams: [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)
