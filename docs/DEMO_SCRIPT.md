# Demo Video Script

Keep the video under 3 minutes.

## 0:00-0:25 - Problem

> Teams do not forget because they lack documents. They forget because decisions are buried across docs, meeting notes, transcripts, and launch checklists.

## 0:25-0:45 - Product

> Debrief recovers a cited Decision Brief from scattered team context: what was decided, why, who owns it, what is risky or contradictory, and what is still unresolved.

## 0:45-1:25 - Live Setup

1. Open [https://debrief-psi.vercel.app](https://debrief-psi.vercel.app)
2. Sign in with the demo account (`demo@debrief.app`)
3. Open **Launch Planning**
4. Show the uploaded files from `examples/launch-planning` (or upload if needed)
5. Confirm documents show **Ready**

## 1:25-2:05 - Decision Brief

Click **Generate brief** / **Regenerate brief** and show structured rows:

- Key decisions — with **rationale**, **owner**, **confidence**
- Owners roster
- Open questions
- Risks and conflicts (call out severity / contradiction)
- Important dates (call out date conflicts)
- Action items with owners
- Source chips on a row — click one to highlight the document

Say:

> This is the first pass a team needs before a launch review — not a generic summary.

## 2:05-2:40 - Cited Follow-ups

Click **Ask** on a decision row, or type:

> What did we decide about pricing and why?

Then ask:

> What is still unresolved before launch?

Point out streaming answers, source citations, excerpts, and relevance scores.

## 2:40-3:00 - Technical Close

> Under the hood, Debrief uses React, FastAPI, PostgreSQL with pgvector, and OpenRouter free models for embeddings, decision briefs, and cited streaming answers. Codex helped build the backend, retrieval layer, SSE streaming, structured brief UI, and deployment setup during Build Week.

End with the GitHub repo and live URL.

## Recording Tips

- Use 1920x1080
- Hide browser bookmarks
- Pre-seed the workspace before recording if ingestion is slow
- Confirm OpenRouter keys and models work before recording
- Keep the live demo focused on one story: launch planning
- Prefer regenerating the brief so judges see owners/rationale/sources, not flat bullets
