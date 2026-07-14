# Devpost Submission Template

Copy this into [openai.devpost.com](https://openai.devpost.com/) when submitting.

## Project Name

**Debrief**

## Tagline

Recover decisions buried in scattered team docs

## Elevator Pitch

Debrief turns scattered project documents, meeting notes, launch plans, and transcripts into a cited team-memory workspace. Upload files, generate a decision brief, then ask follow-up questions with streaming answers grounded in your sources.

Instead of asking teams to search through every doc manually, Debrief answers: what was decided, why, who owns it, what is risky, and what is still unresolved.

## Live Demo

**URL:** `https://YOUR-VERCEL-URL.vercel.app` *(replace after deploy)*

**Test account:**  
Email: `demo@debrief.app`  
Password: `DemoBuildWeek2026!`

Suggested pre-seeded workspace: **Launch Planning** using files from `examples/launch-planning`.

Seed locally or on the deployed backend:

```bash
cd backend
alembic upgrade head
python scripts/seed_demo.py
```

## Video Demo

**URL:** `https://youtube.com/...` or Loom link under 3 minutes.

## Built With Codex

This project was built during OpenAI Build Week using Codex as an AI pair programmer. Codex accelerated the FastAPI backend, pgvector retrieval queries, SSE streaming, frontend workflow polish, deployment configuration, and README/submission packaging.

I made the product decisions around the core workflow: decision briefs, citation transparency, workspace isolation, and the demo story for fast-moving teams.

## How We Use GPT-5.6

| Capability | Implementation |
|------------|----------------|
| Document indexing | `text-embedding-3-small` embeddings stored in PostgreSQL + pgvector |
| Decision brief | GPT-5.6 structured JSON: decisions, open questions, risks, dates, action items |
| Streaming Q&A | GPT-5.6 via Chat Completions with retrieved context and source citations |
| Retrieval | Custom cosine similarity search scoped to each workspace |

We chose custom RAG over hosted file search for workspace isolation, citation provenance, and transparent retrieval scores.

## Problem

Teams do not forget because they lack documents. They forget because decisions are buried across docs, meeting notes, launch checklists, and transcripts. Before an important launch or review, people waste time reconstructing what already happened.

## Solution

Debrief gives every project a living memory layer:

- Upload project context
- Generate a decision brief
- Review key decisions, open questions, risks, dates, and action items
- Ask follow-up questions
- Verify answers with source citations and excerpts

## What Makes It Creative

This is not positioned as another generic PDF chatbot. The app is built around a sharper workflow: recovering team decisions from scattered context, then making those decisions verifiable with citations.

## Tech Stack

React, TypeScript, FastAPI, PostgreSQL, pgvector, OpenAI API, Vercel, Railway/Render, Supabase.

## Repository

`https://github.com/YatharthSharma1309/debrief`

## Judging Criteria Mapping

**Technological Implementation:** Full RAG pipeline, pgvector retrieval, streaming SSE responses, structured GPT output, auth, workspaces, file parsing, and deployment configs.

**Design:** End-to-end workflow: workspace -> upload -> decision brief -> suggested questions -> cited chat.

**Potential Impact:** Fast-moving teams can recover decisions, owners, risks, and unresolved questions before launches or meetings.

**Quality of the Idea:** The wedge is team memory and decision recovery, not generic document chat.
