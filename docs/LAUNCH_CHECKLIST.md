# Debrief Launch Checklist

Use this before hackathon submission.

## 1. Local E2E

Start services:

```powershell
docker compose up -d
cd backend
.venv\Scripts\activate
alembic upgrade head
uvicorn app.main:app --reload
```

Start frontend:

```powershell
cd frontend
npm run dev
```

Test flow:

- [ ] Register a new account
- [ ] Create workspace **Launch Planning**
- [ ] Upload files from `examples/launch-planning`
- [ ] Confirm all documents reach **Ready**
- [ ] Click **Generate brief**
- [ ] Verify key decisions, open questions, risks, dates, and actions render
- [ ] Ask: `What did we decide about pricing and why?`
- [ ] Ask: `What is still unresolved before launch?`
- [ ] Verify streaming answers, citations, excerpts, and relevance scores
- [ ] Refresh page and confirm chat history persists
- [ ] Toggle dark mode
- [ ] Delete a document and confirm it disappears

## 2. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md).

- [ ] Supabase DB with `CREATE EXTENSION vector`
- [ ] Railway/Render backend
- [ ] Vercel frontend
- [ ] `VITE_API_BASE_URL` points to backend `/api`
- [ ] `FRONTEND_URL` included in backend CORS
- [ ] `OPENAI_API_KEY` set
- [ ] `OPENAI_CHAT_MODEL` confirmed available
- [ ] Live E2E passes

## 3. Screenshots

Save to `screenshots/`:

| File | Screen |
|------|--------|
| `01-landing.png` | Home page |
| `02-dashboard.png` | Workspace list |
| `03-upload.png` | Launch Planning upload |
| `04-decision-brief.png` | Generated Decision Brief |
| `05-cited-chat.png` | Streaming answer with citations |
| `06-risks-open-questions.png` | Unresolved risks/open questions |
| `07-dark-mode.png` | Dark mode |

## 4. Demo Video

Follow [DEMO_SCRIPT.md](./DEMO_SCRIPT.md). Keep it under 3 minutes.

## 5. Submit

- [ ] README has live demo URL
- [ ] Devpost copy is filled
- [ ] Video URL is public
- [ ] Repository URL is correct
- [ ] `/feedback` Codex session ID is ready
- [ ] Submit before deadline buffer
