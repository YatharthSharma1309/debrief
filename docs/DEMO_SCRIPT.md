# Demo Video Script

Keep the video under 3 minutes.

## 0:00-0:25 - Problem

> Teams do not forget because they lack documents. They forget because decisions are buried across docs, meeting notes, transcripts, and launch checklists.

## 0:25-0:45 - Product

> Debrief turns scattered team context into a cited decision brief: what was decided, why, who owns it, what is risky, and what is still unresolved.

## 0:45-1:25 - Live Setup

1. Open the live app
2. Sign in with the demo account
3. Open or create **Launch Planning**
4. Upload files from `examples/launch-planning`
5. Wait for documents to show **Ready**

## 1:25-2:05 - Decision Brief

Click **Generate brief** and show:

- Key decisions
- Open questions
- Risks and conflicts
- Important dates
- Action items

Say:

> This is the first pass a team needs before a launch review.

## 2:05-2:40 - Cited Chat

Ask:

> What did we decide about pricing and why?

Then ask:

> What is still unresolved before launch?

Point out streaming answers, source citations, excerpts, and relevance scores.

## 2:40-3:00 - Technical Close

> Under the hood, Debrief uses React, FastAPI, PostgreSQL with pgvector, OpenAI embeddings, and GPT-5.6 for decision briefs and cited streaming answers. Codex helped build the backend, retrieval layer, SSE streaming, UI, and deployment setup during Build Week.

End with the GitHub repo and live URL.

## Recording Tips

- Use 1920x1080
- Hide browser bookmarks
- Pre-seed the workspace before recording if ingestion is slow
- Confirm the OpenAI model name works before recording
- Keep the live demo focused on one story: launch planning
