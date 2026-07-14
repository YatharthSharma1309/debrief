import json
import uuid
from datetime import datetime, timezone

from openai import AsyncOpenAI
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models import Document, DocumentStatus, Workspace
from app.prompts.summary import SUMMARY_QUERY, SUMMARY_SYSTEM_PROMPT, SUGGESTED_QUESTIONS_SYSTEM
from app.rag.search import retrieve_relevant_chunks
from app.schemas.summary import SuggestedQuestionsResponse, WorkspaceSummaryResponse


async def count_ready_documents(db: AsyncSession, workspace_id: uuid.UUID) -> int:
    result = await db.execute(
        select(func.count())
        .select_from(Document)
        .where(Document.workspace_id == workspace_id, Document.status == DocumentStatus.ready)
    )
    return result.scalar_one()


async def _get_context_chunks(db: AsyncSession, workspace_id: uuid.UUID, top_k: int = 12):
    return await retrieve_relevant_chunks(db, workspace_id, SUMMARY_QUERY, top_k=top_k)


async def _call_json_llm(system: str, user_content: str) -> dict | list:
    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY is not configured")

    client = AsyncOpenAI(api_key=settings.openai_api_key)
    response = await client.chat.completions.create(
        model=settings.openai_chat_model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user_content},
        ],
        temperature=0.2,
        response_format={"type": "json_object"},
    )
    content = response.choices[0].message.content or "{}"
    return json.loads(content)


def _format_excerpts(chunks) -> str:
    if not chunks:
        return "No document excerpts available."
    blocks = []
    for index, chunk in enumerate(chunks, start=1):
        page = f", page {chunk.page_number}" if chunk.page_number else ""
        blocks.append(f"[Excerpt {index}] {chunk.filename}{page}\n{chunk.content}")
    return "\n\n".join(blocks)


def _summary_from_payload(payload: dict, generated_at: datetime | None = None) -> WorkspaceSummaryResponse:
    return WorkspaceSummaryResponse(
        overview=payload.get("overview", ""),
        key_decisions=payload.get("key_decisions", []),
        open_questions=payload.get("open_questions", []),
        risks=payload.get("risks", []),
        important_dates=payload.get("important_dates", []),
        action_items=payload.get("action_items", []),
        suggested_questions=payload.get("suggested_questions", []),
        generated_at=generated_at,
    )


async def get_workspace_summary(
    db: AsyncSession, workspace: Workspace
) -> WorkspaceSummaryResponse | None:
    if not workspace.decision_brief:
        return None
    return _summary_from_payload(workspace.decision_brief, workspace.decision_brief_at)


async def generate_workspace_summary(
    db: AsyncSession, workspace: Workspace
) -> WorkspaceSummaryResponse:
    ready_count = await count_ready_documents(db, workspace.id)
    if ready_count == 0:
        raise ValueError("Upload and process at least one document before generating a summary")

    chunks = await _get_context_chunks(db, workspace.id)
    excerpts = _format_excerpts(chunks)

    data = await _call_json_llm(
        SUMMARY_SYSTEM_PROMPT,
        f"Document excerpts:\n\n{excerpts}",
    )

    summary = _summary_from_payload(data)
    now = datetime.now(timezone.utc)
    workspace.decision_brief = summary.model_dump(mode="json", exclude={"generated_at"})
    workspace.decision_brief_at = now
    await db.commit()
    await db.refresh(workspace)

    return _summary_from_payload(workspace.decision_brief, workspace.decision_brief_at)


async def generate_suggested_questions(
    db: AsyncSession, workspace: Workspace, *, use_ai: bool = True
) -> SuggestedQuestionsResponse:
    if workspace.decision_brief:
        questions = workspace.decision_brief.get("suggested_questions") or []
        if questions:
            return SuggestedQuestionsResponse(questions=questions[:4])

    ready_count = await count_ready_documents(db, workspace.id)
    if ready_count == 0:
        return SuggestedQuestionsResponse(
            questions=[
                "What decisions have already been made?",
                "What is still unresolved?",
                "Who owns the next actions?",
                "What risks or contradictions should I review?",
            ]
        )

    fallback = SuggestedQuestionsResponse(
        questions=[
            "What decisions have already been made?",
            "What did we decide about pricing and why?",
            "Who owns launch readiness?",
            "What is still unresolved before launch?",
        ]
    )

    if not use_ai or not settings.openai_api_key:
        return fallback

    try:
        chunks = await _get_context_chunks(db, workspace.id, top_k=8)
        excerpts = _format_excerpts(chunks)
        data = await _call_json_llm(
            SUGGESTED_QUESTIONS_SYSTEM,
            f"Document excerpts:\n\n{excerpts}\n\nReturn JSON: {{\"questions\": [\"...\", \"...\", \"...\", \"...\"]}}",
        )
        if isinstance(data, dict) and "questions" in data:
            questions = data["questions"]
        elif isinstance(data, list):
            questions = data
        else:
            questions = []
        return SuggestedQuestionsResponse(questions=(questions or fallback.questions)[:4])
    except Exception:
        return fallback
