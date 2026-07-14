# Debrief — Logins & Access

Public demo credentials and live URLs for trial / Build Week judging.  
**Do not put API keys, Neon passwords, JWT secrets, or Railway tokens in this file.** Those stay in local `backend/.env` and host dashboards only.

## Live URLs

| Surface | URL |
|---------|-----|
| Frontend (Vercel) | https://debrief-psi.vercel.app |
| Backend API (Railway) | https://debrief-api-production.up.railway.app |
| API health | https://debrief-api-production.up.railway.app/health |
| API docs | https://debrief-api-production.up.railway.app/docs |
| GitHub repo | https://github.com/YatharthSharma1309/debrief |

## App login (demo account)

| Field | Value |
|-------|-------|
| Email | `demo@debrief.app` |
| Password | `DemoBuildWeek2026!` |
| Display name | Build Week Judge |
| Workspace | **Launch Planning** (pre-seeded sample docs + Decision Brief) |

Seed / refresh locally (after `OPENROUTER_API_KEY` + DB are configured):

```bash
cd backend
alembic upgrade head
python scripts/seed_demo.py
```

## Third-party accounts (where secrets live)

| Service | Purpose | Where credentials are stored |
|---------|---------|------------------------------|
| OpenRouter | Chat + embeddings (free models) | `backend/.env` → `OPENROUTER_API_KEY` · Railway env · [openrouter.ai/keys](https://openrouter.ai/keys) |
| Neon | Postgres + pgvector | `backend/.env` → `DATABASE_URL` · Railway env · Neon console |
| Railway | Backend hosting | Railway dashboard · CLI login |
| Vercel | Frontend hosting | Vercel dashboard (`VITE_API_BASE_URL`) |

## Local register (optional)

You can also create a new account via **Get started** / **Register** on the live site. That account is private to the Neon DB and is not listed here.
