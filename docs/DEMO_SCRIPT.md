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

## 2:40-3:00 - Technical Close (Codex + GPT-5.6 required)

Say clearly (judges require voiceover on both tools):

> Under the hood, Debrief uses React, FastAPI, PostgreSQL with pgvector, and OpenRouter free models for embeddings, decision briefs, and cited streaming answers.
>
> I built this during OpenAI Build Week with **Codex powered by GPT-5.6** — using it to scaffold the FastAPI RAG backend, design the Decision Brief schema, wire SSE streaming and citations, and ship the UI plus deployment.
>
> Codex and GPT-5.6 were my build partners. OpenRouter free models keep the live demo free for judges to test.

End with the GitHub repo and live URL.

## Required voiceover checklist

Your narration must cover all three:

1. **What you built** — Decision Briefs from scattered docs
2. **How you used Codex** — specific: backend, retrieval, SSE, brief UI, deploy
3. **How you used GPT-5.6** — Codex runs on GPT-5.6; it drove architecture and implementation during Build Week

A silent screencast or music-only video will not meet Build Week rules.

## Recording Tips

- Use 1920x1080
- Hide browser bookmarks
- Pre-seed the workspace before recording if ingestion is slow
- Confirm OpenRouter keys and models work before recording
- Keep the live demo focused on one story: launch planning
- Prefer regenerating the brief so judges see owners/rationale/sources, not flat bullets
