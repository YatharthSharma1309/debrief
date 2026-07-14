# Debrief Planning Notes

## Product Direction

Debrief is positioned as a Work & Productivity tool for fast-moving teams. The wedge is not generic document chat; it is recovering decisions, rationale, owners, risks, and unresolved questions from scattered project context.

## MVP Checklist

- [x] User authentication
- [x] Workspace creation
- [x] File upload for PDF, DOCX, TXT
- [x] Document parsing and chunking
- [x] OpenAI embedding generation
- [x] pgvector search
- [x] Streaming chat with citations
- [x] Chat history
- [x] Decision brief schema
- [x] Decision-focused prompts
- [x] Dark mode
- [ ] Live deployment
- [ ] Screenshots
- [ ] Demo video

## Demo Focus

Workspace: **Launch Planning**

Questions:

- What decisions have already been made?
- What did we decide about pricing and why?
- Who owns launch readiness?
- What is still unresolved before launch?
- Are there conflicting dates or risks?

## OpenAI Setup

1. Create an API key at https://platform.openai.com/api-keys
2. Put it in `backend/.env` as `OPENROUTER_API_KEY` (free key from https://openrouter.ai/keys)
3. Confirm `LLM_CHAT_MODEL` / `LLM_EMBEDDING_MODEL` (defaults use OpenRouter free models)
4. Never commit `.env`

## Milestones

### Foundation

- Auth
- Database schema
- Workspaces

### Documents

- Uploads
- Parsing
- Chunking
- Embeddings

### Intelligence

- Decision brief
- Suggested questions
- Cited streaming chat

### Launch

- Deployment
- README polish
- Sample dataset
- Screenshots
- Demo video
- Devpost submission
