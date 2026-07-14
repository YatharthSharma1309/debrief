# Debrief Architecture

## Overview

Debrief is a RAG-powered team-memory workspace. Users upload project documents, notes, and transcripts into workspaces. The backend parses, chunks, embeds, and indexes content in PostgreSQL with pgvector. Decision briefs and chat queries retrieve relevant chunks and use the OpenAI API to produce cited decisions, risks, open questions, and follow-up answers.

## Why PostgreSQL + pgvector?

We use PostgreSQL + pgvector because:

- Users, workspaces, documents, chunks, chat history, and embeddings live in one database
- It is straightforward to deploy on Supabase, Railway, Render, or similar platforms
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
| `services/` | Auth, workspaces, documents, chat, summaries |
| `rag/` | Retrieval pipeline |
| `embeddings/` | OpenAI embedding generation |
| `prompts/` | Decision brief and RAG prompts |

## Data Flow

### Document Ingestion

1. User uploads a PDF, DOCX, or TXT file
2. Backend validates and stores the file
3. Parser extracts text
4. Chunker splits text with overlap
5. OpenAI embeddings are generated
6. Chunks and embeddings are stored in `document_chunks`
7. Document status changes to `ready`

### Decision Brief

1. User clicks **Generate brief**
2. Backend retrieves representative chunks from the workspace
3. GPT-5.6 returns structured JSON:
   - overview
   - key decisions
   - open questions
   - risks
   - important dates
   - action items
   - suggested questions
4. Frontend renders the brief as a decision workspace summary

### Cited Chat

1. User asks a question
2. Query is embedded
3. pgvector retrieves the most relevant chunks
4. GPT-5.6 streams an answer using only retrieved context
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
| Backend | Railway or Render |
| Database | Supabase PostgreSQL + pgvector |
