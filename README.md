# ContextAI

**An intelligent workspace for documents** — upload files, organize knowledge into workspaces, and chat with cited, streaming AI answers.

Built as a flagship portfolio project showcasing AI engineering, full-stack development, production-ready architecture, and modern UI/UX.

## Features (MVP roadmap)

- [ ] User authentication
- [ ] Workspace creation
- [ ] File upload & document processing
- [ ] Embedding generation & vector search (pgvector)
- [ ] AI chat with citations & streaming responses
- [ ] Chat history

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Tailwind CSS, React Router, TanStack Query, Zustand |
| Backend | FastAPI, Python, SQLAlchemy |
| Database | PostgreSQL + pgvector |
| AI | OpenAI API (embeddings + chat) |
| Deployment | Vercel (frontend), Railway/Render (backend), Supabase (DB) |

## Project structure

```text
context-ai/
├── frontend/          # React + TypeScript app
├── backend/           # FastAPI application
├── docs/              # Architecture & planning docs
├── screenshots/       # Demo screenshots
├── examples/        # Sample documents & API examples
└── README.md
```

## Getting started

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL 15+ with [pgvector](https://github.com/pgvector/pgvector) extension
- OpenAI API key

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env   # then add your OPENAI_API_KEY

uvicorn app.main:app --reload --app-dir .
```

API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
cp .env.example .env

npm run dev
```

App: http://localhost:5173

## Architecture

```text
                React Frontend
                      │
          REST + Streaming API
                      │
                FastAPI Backend
         ┌────────────┼────────────┐
         │            │            │
 Authentication   PostgreSQL   OpenAI API
         │            │            │
         └────────────┼────────────┘
                      │
                pgvector Search
                      │
               Uploaded Documents
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

## Milestones

1. **Foundation** — Project setup, authentication, database
2. **Documents** — File upload, parsing, embeddings
3. **Chat** — RAG pipeline, streaming responses
4. **Polish** — UI refinement, deployment
5. **Launch** — README, demo video, submission

## License

MIT
