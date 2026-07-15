# Devpost Submission Template

Copy this into [openai.devpost.com](https://openai.devpost.com/) when submitting.

## Project Name

**Debrief**

## Tagline

Recover decisions buried in scattered team docs

## Elevator Pitch

Debrief recovers decisions, rationale, owners, risks, open questions, and dates from scattered project documents, meeting notes, launch plans, and transcripts. Upload files, generate a cited **Decision Brief** (structured rows with sources), then verify with cited follow-ups.

Instead of re-reading every doc before a launch review, Debrief answers: what was decided, why, who owns it, what is risky or contradictory, and what is still unresolved.

## Live Demo

**URL:** [https://debrief-psi.vercel.app](https://debrief-psi.vercel.app)

**API:** [https://debrief-api-production.up.railway.app](https://debrief-api-production.up.railway.app)

**Test account:**  
Email: `demo@debrief.app`  
Password: `DemoBuildWeek2026!`

Pre-seeded workspace: **Launch Planning** (`examples/launch-planning`).

Seed locally or on the deployed backend:

```bash
cd backend
alembic upgrade head
python scripts/seed_demo.py
```

## Video Demo

**URL:** `https://youtube.com/...` or Loom link under 3 minutes.

## Built With Codex

This project was built during OpenAI Build Week using Codex as an AI pair programmer. Codex accelerated the FastAPI backend, pgvector retrieval, OpenRouter wiring, SSE streaming, structured Decision Brief schema/UI, frontend workflow polish, deployment configuration, and README/submission packaging.

I made the product decisions around the core workflow: decision recovery (not chat-with-PDF), citation transparency, workspace isolation, and the launch-planning demo story.

## How We Use Models (OpenRouter)

| Capability | Implementation |
|------------|----------------|
| Document indexing | OpenRouter embeddings (`nvidia/llama-nemotron-embed-vl-1b-v2:free`, 2048-d) → PostgreSQL + pgvector |
| Decision Brief | Structured JSON: decisions (rationale, owner, confidence + sources), open questions, risks/contradictions, dates, action items, owners, suggested asks |
| Cited follow-ups | Chat Completions over retrieved chunks with `[Source N]` citations, excerpts, and relevance % |
| Retrieval | Cosine similarity search scoped to each workspace |

We chose custom RAG over hosted file search for workspace isolation, citation provenance, and transparent retrieval scores. Runtime uses **OpenRouter free models** so the demo stays free to operate.

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

## Repository

`https://github.com/YatharthSharma1309/debrief`

## Judging Criteria Mapping

**Technological Implementation:** Full RAG pipeline, pgvector retrieval, streaming SSE responses, structured brief JSON, auth, workspaces, file parsing, OpenRouter free runtime, and deployment configs.

**Design:** End-to-end workflow: workspace → upload → Decision Brief (ask-from-row + source jump) → cited follow-ups.

**Potential Impact:** Fast-moving teams can recover decisions, rationale, owners, risks, and unresolved questions before launches or meetings.

**Quality of the Idea:** The wedge is decision recovery from scattered team context — not generic document chat.
