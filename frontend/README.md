# Debrief — Frontend

React + TypeScript + Vite UI for **Debrief**.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Environment

Copy `.env.example` to `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

On Vercel, set `VITE_API_BASE_URL` to the deployed backend URL ending in `/api`.

## Main routes

| Path | Page |
|------|------|
| `/` | Landing |
| `/login`, `/register` | Auth |
| `/dashboard` | Workspaces |
| `/workspaces/:id` | Documents, Decision Brief, cited chat |

See the root [README](../README.md) for full stack setup.
