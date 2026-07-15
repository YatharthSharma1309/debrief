# Competitive landscape — Debrief

Debrief recovers **decisions, rationale, owners, risks, open questions, and dates** from scattered team docs (PRDs, notes, transcripts, checklists) — not “chat with a PDF.”

Research date: July 2026.

## Category map

| Bucket | What they optimize for | Closest to Debrief? |
| --- | --- | --- |
| Meeting capture | Live transcript + action items | Partial (audio-only) |
| Source-grounded research | Citations over uploaded corpora | Adjacent (Q&A / study) |
| Enterprise search | Find docs across Slack/Drive/etc. | Adjacent (discovery) |
| Analyst grids | Structured extraction across many files | Conceptually closest |
| Workspace AI | Summarize notes already in Notion etc. | Adjacent |

## Products worth knowing

### NotebookLM (Google)
- Upload sources → grounded answers, study guides, audio overviews, citations.
- Strong on “answer from these PDFs,” weak on persisting a **decision brief** with owners/rationale/stale signals for a delivery team.
- Steal: always cite sources; keep answers corpus-bound.

### Fireflies / Otter / Fathom / Granola
- Capture meetings; summaries and action items; searchable libraries; CRM hooks (Fireflies).
- Optimize for **calls**, not mixed artifact sets (PRD + pricing notes + checklist).
- Steal: action items with owners; searchable history — Debrief applies that pattern to uploaded workspaces.

### Notion AI / ChatGPT Projects
- Flexible Q&A over pasted or linked context.
- User must keep structure; no opinionated decision schema.
- Steal: decision-forcing questions (“who owns X / what’s unresolved?”) beat “summarize this.”

### Glean
- Horizontal enterprise search across SaaS.
- Finds information; does not own a project decision ledger.
- Out of Build Week scope (connectors). Debrief stays workspace-scoped uploads.

### Hebbia Matrix
- Rows × columns grid; agents fill structured, citation-linked cells over large corpora (finance/legal diligence).
- Closest **information-density** pattern: structured cells + sources, not chat paragraphs.
- Steal for Debrief Build Week: **structured brief rows** (decision / risk / date / action) each with owner, severity, and source chips — not a Matrix UI.

## Gaps Debrief fills

1. **Multi-artifact decision recovery** — PRD + notes + transcript + checklist in one workspace brief.
2. **Opinionated brief schema** — decisions (rationale, owner, confidence), risks/contradictions, dates with conflicts, actions, owners roster, suggested asks.
3. **Stale signal** — regenerate when docs change after `generated_at`.
4. **Ask-from-row** — every row seeds cited chat.
5. **Source jump** — citation chip → highlight document in the list.

## What not to build (yet)

- Live meeting bots (Fireflies space)
- Org-wide connectors (Glean space)
- Full analyst Matrix spreadsheet (Hebbia space)

## Design implication (shipped direction)

Density comes from **structured items with metadata + per-item sources**, expand-to-evidence, citation→doc, and stale-brief badges — not longer overview prose or more landing-page marketing copy.

## Sources

- [AI meeting notes comparison (Otter / Fireflies / NotebookLM)](https://penchan.co/en/ai/meeting/meeting-tools-comparison/)
- [Messy notes → decisions tool roles (2026)](https://pickuma.com/for-dev/ai-tools-messy-notes-into-decisions-2026/)
- [Meeting / research note-taker landscape](https://www.techraisal.com/blog/best-ai-note-taking-tools-tested-across-meetings-research-and-daily-workflows/)
- [Hebbia vs Glean category split](https://agent.nexus/blog/hebbia-vs-glean)
- [Hebbia Matrix multi-agent redesign](https://www.hebbia.com/blog/divide-and-conquer-hebbias-multi-agent-redesign)
