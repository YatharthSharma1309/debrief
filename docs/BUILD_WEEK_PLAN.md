# OpenAI Build Week Launch Plan

## Project

**Debrief**

**Track:** Work & Productivity

**Positioning:** Memory infrastructure for fast-moving teams. Debrief turns scattered project docs and meeting notes into cited decisions, risks, action items, and follow-up answers.

## Why It Fits

| Judging Criterion | How Debrief Fits |
|-------------------|------------------------------------|
| Technological Implementation | Custom RAG, pgvector, streaming SSE, structured GPT output, auth, workspaces |
| Design | Complete flow: upload context -> generate brief -> ask cited follow-ups |
| Potential Impact | Helps teams recover decisions and unresolved risks before launches/reviews |
| Quality of Idea | Sharper than document chat: decision recovery and team memory |

## Demo Persona

**Target user:** Product or operations lead preparing for a launch review.

**One-liner:**  
Before: search six docs to reconstruct what the team decided.  
After: generate a cited decision brief and ask follow-ups in one workspace.

## MVP Scope

Build and polish only what supports the 3-minute demo:

- Decision Brief summary
- Decision-focused suggested questions
- Cited streaming chat
- Sample launch-planning dataset
- Working deployment
- README, screenshots, video, Devpost copy

Avoid OCR, sharing, exports, global search, and complex permissions for this submission.

## Blocking Fixes

- [ ] Confirm production `LLM_CHAT_MODEL` works (default `openrouter/free`)
- [ ] Run backend with `DEBUG=false` or supported production values
- [ ] Verify upload cleanup handles failed/oversized files
- [ ] Run local E2E with Postgres + pgvector
- [ ] Run live E2E after deployment

## Execution Plan

### Phase 1 - Product Repositioning

- [x] Rename project to Debrief / `debrief`
- [x] Rename GitHub repo to `debrief`
- [x] Update frontend copy and browser metadata
- [x] Update summary schema to decisions/open questions/risks
- [x] Update README and submission docs
- [ ] Add final screenshots

### Phase 2 - Demo Data

- [ ] Upload files from `examples/launch-planning`
- [ ] Ensure sample docs include a pricing decision, owner, risk, date, and contradiction
- [ ] Test questions:
  - What decisions have already been made?
  - What did we decide about pricing and why?
  - Who owns launch readiness?
  - What is still unresolved before launch?
  - Are there conflicting dates or risks?

### Phase 3 - Deployment

- [ ] Supabase Postgres with `vector` extension
- [ ] Railway/Render backend
- [ ] Vercel frontend
- [ ] Set `VITE_API_BASE_URL`
- [ ] Set `FRONTEND_URL` and CORS
- [ ] Replace live demo placeholders

### Phase 4 - Submission Assets

- [ ] Capture screenshots
- [ ] Record <3 minute video
- [ ] Push final code to GitHub
- [ ] Submit Devpost before the deadline buffer

## GPT-5.6 Story

| Feature | Model/API |
|---------|-----------|
| Embeddings | `text-embedding-3-small` Embeddings API |
| Decision Brief | GPT-5.6 structured JSON |
| Streaming Chat | GPT-5.6 Chat Completions streaming |
| Retrieval | Custom pgvector cosine similarity |

## Codex Story

Mention that Codex helped with:

- FastAPI routes and schemas
- pgvector retrieval
- SSE streaming
- frontend workflow polish
- deployment configs
- README and Devpost packaging

## Demo Timing

| Time | Content |
|------|---------|
| 0:00-0:25 | Problem: decisions buried in scattered context |
| 0:25-0:45 | Product: cited decision briefs |
| 0:45-1:25 | Open workspace and upload launch-planning docs |
| 1:25-2:05 | Generate Decision Brief |
| 2:05-2:40 | Ask cited follow-up questions |
| 2:40-3:00 | Architecture + Codex/GPT-5.6 close |
