# Database Schema

## Entity relationship

```text
users
  └── workspaces
        ├── documents
        │     └── document_chunks (embedding: vector(1536))
        └── chat_sessions
              └── chat_messages
```

## Tables

### users

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique, indexed |
| hashed_password | VARCHAR(255) | bcrypt hash |
| full_name | VARCHAR(255) | Optional |
| created_at | TIMESTAMPTZ | Auto-set |
| updated_at | TIMESTAMPTZ | Auto-updated |

### workspaces

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| name | VARCHAR(255) | Required |
| description | TEXT | Optional |
| created_at | TIMESTAMPTZ | Auto-set |
| updated_at | TIMESTAMPTZ | Auto-updated |

### documents

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| workspace_id | UUID | FK → workspaces |
| filename | VARCHAR(512) | Original filename |
| file_type | VARCHAR(50) | e.g. pdf, docx, txt |
| file_size | INTEGER | Bytes |
| storage_path | VARCHAR(1024) | Server-side path |
| status | ENUM | pending, processing, ready, failed |
| error_message | TEXT | Set when status = failed |
| created_at | TIMESTAMPTZ | Auto-set |
| updated_at | TIMESTAMPTZ | Auto-updated |

### document_chunks

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| document_id | UUID | FK → documents |
| workspace_id | UUID | FK → workspaces (denormalized for scoped search) |
| chunk_index | INTEGER | Order within document |
| content | TEXT | Chunk text |
| page_number | INTEGER | Optional source page |
| embedding | vector(1536) | OpenAI text-embedding-3-small |
| created_at | TIMESTAMPTZ | Auto-set |

### chat_sessions

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| workspace_id | UUID | FK → workspaces |
| user_id | UUID | FK → users |
| title | VARCHAR(255) | Optional, auto-generated later |
| created_at | TIMESTAMPTZ | Auto-set |
| updated_at | TIMESTAMPTZ | Auto-updated |

### chat_messages

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| session_id | UUID | FK → chat_sessions |
| role | ENUM | user, assistant, system |
| content | TEXT | Message body |
| citations | JSONB | Source references for assistant messages |
| created_at | TIMESTAMPTZ | Auto-set |

## Migrations

```bash
cd backend
.venv\Scripts\activate
alembic upgrade head
```

Requires PostgreSQL with the [pgvector](https://github.com/pgvector/pgvector) extension available.

## Auth API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Get JWT access token |
| GET | `/api/auth/me` | Current user (Bearer token required) |

## Workspaces API

All workspace endpoints require a Bearer token. Users can only access their own workspaces.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces` | List workspaces |
| POST | `/api/workspaces` | Create workspace |
| GET | `/api/workspaces/{id}` | Get workspace |
| PATCH | `/api/workspaces/{id}` | Update workspace |
| DELETE | `/api/workspaces/{id}` | Delete workspace |

## Documents API

All document endpoints require a Bearer token and workspace ownership.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces/{id}/documents` | List documents |
| POST | `/api/workspaces/{id}/documents` | Upload file (multipart) |
| GET | `/api/workspaces/{id}/documents/{doc_id}` | Get document |
| DELETE | `/api/workspaces/{id}/documents/{doc_id}` | Delete document |

Upload triggers background processing: parse → chunk → embed → store in pgvector.

## Chat API

All chat endpoints require a Bearer token and workspace ownership.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces/{id}/chat/sessions` | List chat sessions |
| POST | `/api/workspaces/{id}/chat/sessions` | Create chat session |
| GET | `/api/workspaces/{id}/chat/sessions/{sid}/messages` | List messages |
| POST | `/api/workspaces/{id}/chat/sessions/{sid}/messages` | Send message (SSE stream) |

The chat endpoint streams Server-Sent Events:
- `token` — partial assistant response text
- `citations` — source references from RAG retrieval
- `done` — message IDs after persistence
