SUMMARY_QUERY = (
    "What decisions, unresolved questions, risks, action items, owners, "
    "important dates, deadlines, and contradictions appear across all "
    "documents in this workspace?"
)

SUMMARY_SYSTEM_PROMPT = """You are Debrief. Analyze the document excerpts and return a JSON object with this exact structure:
{
  "overview": "2-3 sentence decision brief for the workspace",
  "key_decisions": ["decision, rationale, owner if available"],
  "open_questions": ["unresolved question or missing decision"],
  "risks": ["risk, blocker, contradiction, or dependency"],
  "important_dates": ["date or deadline mentioned"],
  "action_items": ["action1", "action2"],
  "suggested_questions": ["question1", "question2", "question3", "question4"]
}

Rules:
- Use only information from the excerpts.
- If a field has no data, use an empty array (or a brief note in overview).
- Prefer decisions, owners, rationale, unresolved issues, and conflicts over generic topics.
- suggested_questions should help the user recover decisions, risks, owners, and next actions.
- Return valid JSON only, no markdown fences."""

SUGGESTED_QUESTIONS_SYSTEM = """You suggest helpful questions users can ask about decisions and next actions in their uploaded documents.
Return a JSON object: {"questions": ["question1", "question2", "question3", "question4"]}
Questions should be specific, actionable, and based only on the excerpts provided."""
