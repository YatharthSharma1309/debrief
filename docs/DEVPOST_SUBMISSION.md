# Devpost Submission Template

Copy this into [openai.devpost.com](https://openai.devpost.com/) when submitting.

**Track:** Work & Productivity  
**Deadline:** July 21, 2026, 5:00 PM PT

## Project Name

**Debrief**

## Tagline

Recover decisions buried in scattered team docs

## Elevator Pitch / Description

Debrief recovers decisions, rationale, owners, risks, open questions, and dates from scattered project documents, meeting notes, launch plans, and transcripts. Upload files, generate a cited **Decision Brief** (structured rows with sources), then verify with cited follow-ups.

Instead of re-reading every doc before a launch review, Debrief answers: what was decided, why, who owns it, what is risky or contradictory, and what is still unresolved.

**Built with Codex + GPT-5.6** during OpenAI Build Week. The live demo runs on OpenRouter free models so judges can test at $0.

## Live Demo

**URL:** [https://debrief-psi.vercel.app](https://debrief-psi.vercel.app)

**API:** [https://debrief-api-production.up.railway.app](https://debrief-api-production.up.railway.app)

**Test account:**  
Email: `demo@debrief.app`  
Password: `DemoBuildWeek2026!`

Pre-seeded workspace: **Launch Planning** (`examples/launch-planning`).

Judge path: Sign in → open Launch Planning → review Decision Brief → click Ask / ask “What did we decide about pricing and why?”

Seed locally or on the deployed backend:

```bash
cd backend
alembic upgrade head
python scripts/seed_demo.py
```

## Video Demo

**URL:** `REPLACE_WITH_PUBLIC_YOUTUBE_URL`  
Must be public, ≤3 minutes, with voiceover covering product + Codex + GPT-5.6. See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md).

## Built With Codex + GPT-5.6

This project was built during OpenAI Build Week using **Codex** powered by **GPT-5.6** as an AI pair programmer.

Codex + GPT-5.6 accelerated:

- FastAPI backend, auth, workspaces
- pgvector retrieval and document ingestion
- OpenRouter wiring
- SSE streaming cited chat
- Structured Decision Brief schema + UI
- Frontend workflow polish (responsive layout, mobile brief accordion)
- Deployment (Vercel + Railway + Neon) and seed/demo packaging

I made the product decisions: decision recovery (not chat-with-PDF), citation transparency, workspace isolation, and the launch-planning demo story.

**Runtime note:** Live inference uses OpenRouter free models so the demo stays free. Codex + GPT-5.6 were used to **build** the system; OpenRouter powers the **deployed demo**.

## How We Use Models

| Capability | Implementation |
|------------|----------------|
| Build partner | Codex + GPT-5.6 (scaffold, iterate, ship) |
| Document indexing | OpenRouter embeddings → PostgreSQL + pgvector |
| Decision Brief | Structured JSON: decisions (rationale, owner, confidence + sources), open questions, risks/contradictions, dates, action items, owners, suggested asks |
| Cited follow-ups | Chat Completions over retrieved chunks with `[Source N]` citations, excerpts, and relevance % |
| Retrieval | Cosine similarity search scoped to each workspace |

We chose custom RAG over hosted file search for workspace isolation, citation provenance, and transparent retrieval scores.

## Problem

Teams do not forget because they lack documents. They forget because decisions are buried across docs, meeting notes, launch checklists, and transcripts. Before an important launch or review, people waste time reconstructing what already happened.

## Solution

Debrief recovers and persists a cited Decision Brief per workspace:

- Upload project context (PRDs, notes, transcripts, checklists)
- Generate a Decision Brief with owners, rationale, risks, dates, and open questions
- Jump from source chips to the cited document
- Ask follow-ups that verify why / who / what’s unresolved
- Regenerate when docs go stale after the brief was saved

## What Makes It Creative

This is not positioned as another generic PDF chatbot. Competitors optimize for meeting capture (Fireflies/Otter), research Q&A (NotebookLM), or enterprise search (Glean). Debrief’s wedge is **multi-artifact decision recovery** with an opinionated brief schema and verifiable citations.

## Tech Stack

React, TypeScript, FastAPI, PostgreSQL, pgvector, OpenRouter, Neon, Vercel, Railway.  
Built with Codex + GPT-5.6.

## Repository

`https://github.com/YatharthSharma1309/debrief`

## Codex /feedback Session ID

`REPLACE_WITH_CODEX_FEEDBACK_SESSION_ID`  
(Run `/feedback` in your primary Codex build thread.)

## Judging Criteria Mapping

**Technological Implementation:** Full RAG pipeline, pgvector retrieval, streaming SSE responses, structured brief JSON, auth, workspaces, file parsing, OpenRouter free runtime, deployment configs — built with Codex + GPT-5.6.

**Design:** End-to-end workflow: workspace → upload → Decision Brief (ask-from-row + source jump) → cited follow-ups. Responsive UI with mobile brief accordion.

**Potential Impact:** Fast-moving teams can recover decisions, rationale, owners, risks, and unresolved questions before launches or meetings.

**Quality of the Idea:** The wedge is decision recovery from scattered team context — not generic document chat.
