# Deployment Guide

Deploy Debrief with:

- **Frontend** -> Vercel
- **Backend** -> Railway or Render
- **Database** -> Supabase or Neon PostgreSQL with pgvector

## 1. Database

1. Create a Supabase or Neon PostgreSQL project
2. Enable pgvector:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

3. Copy the connection string
4. Use an async SQLAlchemy URL:

```text
postgresql+asyncpg://...
```

The backend also auto-converts `postgres://` and plain `postgresql://` URLs to `postgresql+asyncpg://`.

## 2. Backend

Railway:

1. Create a project from the GitHub repo
2. Set root directory to `backend`
3. Use `backend/Dockerfile`
4. Add environment variables:

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `postgresql+asyncpg://...` |
| `OPENAI_API_KEY` | `sk-...` |
| `OPENAI_CHAT_MODEL` | model available to your account |
| `JWT_SECRET_KEY` | long random string |
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `CORS_ORIGINS` | `["https://your-app.vercel.app"]` |
| `DEBUG` | `false` |

5. Add a persistent volume mounted at `/app/uploads`
6. Deploy and note the public backend URL

Render:

- Use `render.yaml`
- Health check path: `/health`

## 3. Frontend

1. Import the repo on Vercel
2. Set root directory to `frontend`
3. Framework preset: Vite
4. Set:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://your-backend.example.com/api` |

5. Deploy

`frontend/vercel.json` handles SPA routing.

## 4. Post-Deploy Test

- [ ] Register a test account
- [ ] Create workspace **Launch Planning**
- [ ] Upload files from `examples/launch-planning`
- [ ] Wait for **Ready**
- [ ] Generate a **Decision Brief**
- [ ] Ask: `What did we decide about pricing and why?`
- [ ] Confirm streaming response with citations
- [ ] Ask: `What is still unresolved before launch?`
- [ ] Toggle dark mode

## Production Notes

- Railway/Render filesystems are ephemeral unless a volume is attached
- For scale, migrate uploads to S3-compatible object storage
- Never commit `.env`
- Use a strong `JWT_SECRET_KEY`
- Set `DEBUG=false` in production
- Restrict CORS to your frontend domain

## Production Shape

```text
Vercel (React) -> Railway/Render (FastAPI) -> Supabase (pgvector)
                               |
                          OpenAI API
```
