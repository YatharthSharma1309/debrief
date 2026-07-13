# ContextAI Planning Notes

## Vector database decision

**Chosen: PostgreSQL + pgvector**

Rationale documented in [ARCHITECTURE.md](./ARCHITECTURE.md).

## MVP feature checklist

### Core (required)

- [ ] User authentication (register, login, JWT)
- [ ] Workspace creation
- [ ] File upload (PDF, DOCX, TXT)
- [ ] Document parsing & chunking
- [ ] Embedding generation (OpenAI)
- [ ] Vector search (pgvector)
- [ ] AI chat with citations
- [ ] Streaming responses (SSE)
- [ ] Chat history persistence

### Nice-to-have

- [ ] Multiple workspaces UI
- [ ] Share workspace
- [ ] AI-generated summaries
- [ ] Upload timeline
- [ ] Global search
- [ ] Export answers
- [ ] Dark mode

## OpenAI API key setup

1. Go to https://platform.openai.com/api-keys
2. Create a new secret key
3. Copy into `backend/.env` as `OPENAI_API_KEY`
4. Never commit `.env` to git

## GitHub milestones

### Milestone 1 — Foundation
- Project setup
- Authentication
- Database schema

### Milestone 2 — Documents
- File upload
- Document parsing
- Embeddings

### Milestone 3 — Chat
- RAG pipeline
- Streaming chat

### Milestone 4 — Polish
- UI refinement
- Deployment

### Milestone 5 — Launch
- README polish
- Demo video
- Hackathon submission
