# OpenAI Build Week — Submission Checklist

**Hackathon:** [openai.devpost.com](https://openai.devpost.com/)  
**Track:** Work & Productivity  
**Deadline:** Tuesday, July 21, 2026, 5:00 PM PT

Use this before clicking Submit.

## Product readiness (done)

- [x] Working live demo — https://debrief-psi.vercel.app
- [x] Working API — https://debrief-api-production.up.railway.app
- [x] Demo account — `demo@debrief.app` / `DemoBuildWeek2026!`
- [x] Pre-seeded **Launch Planning** workspace
- [x] Public GitHub repo — https://github.com/YatharthSharma1309/debrief
- [x] MIT license
- [x] README with setup, sample data, Codex + GPT-5.6 story
- [x] Devpost copy template — [DEVPOST_SUBMISSION.md](./DEVPOST_SUBMISSION.md)
- [x] Demo video script — [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)
- [x] Screenshots folder — `screenshots/`

## You must complete before submit

- [x] **Demo video file generated** — `docs/demo-assets/debrief-build-week-demo.mp4` (~1:41, AI voiceover covering product + Codex + GPT-5.6)
- [ ] **Upload video to YouTube** (Public) → paste URL into Devpost
  - See `docs/demo-assets/README.md`
- [ ] Run `/feedback` in your **main Codex build thread** → copy Session ID into Devpost form
  - This ID can only come from Codex — it cannot be generated in the repo
- [ ] Confirm repo is **public**
- [ ] Fill Devpost fields from [DEVPOST_SUBMISSION.md](./DEVPOST_SUBMISSION.md)
- [ ] Category: **Work & Productivity**
- [ ] Quick live smoke test as a judge:
  1. Sign in with demo account
  2. Open Launch Planning
  3. Expand Decision Brief sections
  4. Ask one suggested question → streaming cited answer

## Devpost form mapping

| Field | Value |
|-------|-------|
| Project name | Debrief |
| Tagline | Recover decisions buried in scattered team docs |
| Track | Work & Productivity |
| Demo URL | https://debrief-psi.vercel.app |
| Repo URL | https://github.com/YatharthSharma1309/debrief |
| Video | *(your YouTube link)* |
| Codex `/feedback` Session ID | *(from Codex)* |
| Test account | demo@debrief.app / DemoBuildWeek2026! |

## GPT-5.6 story (say this clearly)

> Debrief was built with Codex powered by GPT-5.6 during Build Week — scaffolding the FastAPI/RAG backend, Decision Brief schema, SSE chat, and UI. The live demo runs on OpenRouter free models so judges can test without API cost. Codex + GPT-5.6 = build workflow; OpenRouter = runtime.
