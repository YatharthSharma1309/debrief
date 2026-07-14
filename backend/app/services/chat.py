import json
import uuid
from collections.abc import AsyncIterator

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.llm.client import get_llm_api_key, get_llm_client
from app.models import ChatMessage, ChatSession, MessageRole, User, Workspace
from app.prompts.rag import build_rag_system_prompt
from app.rag.retrieval import RetrievedChunk
from app.rag.search import retrieve_relevant_chunks
from app.schemas.chat import Citation


def chunks_to_citations(chunks: list[RetrievedChunk]) -> list[dict]:
    return [
        Citation(
            document_id=chunk.document_id,
            filename=chunk.filename,
            chunk_index=chunk.chunk_index,
            page_number=chunk.page_number,
            excerpt=chunk.content[:300] + ("..." if len(chunk.content) > 300 else ""),
            score=round(chunk.score, 3),
        ).model_dump(mode="json")
        for chunk in chunks
    ]


async def list_sessions(db: AsyncSession, workspace: Workspace, user: User) -> list[ChatSession]:
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.workspace_id == workspace.id, ChatSession.user_id == user.id)
        .order_by(ChatSession.updated_at.desc())
    )
    return list(result.scalars().all())


async def create_session(
    db: AsyncSession,
    workspace: Workspace,
    user: User,
    title: str | None = None,
) -> ChatSession:
    session = ChatSession(workspace_id=workspace.id, user_id=user.id, title=title)
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


async def get_session(
    db: AsyncSession,
    workspace: Workspace,
    user: User,
    session_id: uuid.UUID,
) -> ChatSession | None:
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.workspace_id == workspace.id,
            ChatSession.user_id == user.id,
        )
    )
    return result.scalar_one_or_none()


async def list_messages(db: AsyncSession, session: ChatSession) -> list[ChatMessage]:
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session.id)
        .order_by(ChatMessage.created_at.asc())
    )
    return list(result.scalars().all())


async def stream_chat_response(
    db: AsyncSession,
    workspace: Workspace,
    session: ChatSession,
    user_content: str,
) -> AsyncIterator[str]:
    if not get_llm_api_key():
        yield _sse({"type": "error", "message": "OPENROUTER_API_KEY is not configured"})
        return

    chunks = await retrieve_relevant_chunks(
        db, workspace.id, user_content, top_k=settings.rag_top_k
    )
    citations = chunks_to_citations(chunks)

    user_message = ChatMessage(
        session_id=session.id,
        role=MessageRole.user,
        content=user_content,
    )
    db.add(user_message)

    if session.title is None:
        session.title = user_content[:50] + ("..." if len(user_content) > 50 else "")

    await db.commit()

    history_result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session.id, ChatMessage.id != user_message.id)
        .order_by(ChatMessage.created_at.desc())
        .limit(settings.chat_history_limit)
    )
    history = list(reversed(history_result.scalars().all()))

    system_prompt = build_rag_system_prompt(chunks)
    messages = [{"role": "system", "content": system_prompt}]
    for msg in history:
        if msg.role in (MessageRole.user, MessageRole.assistant):
            messages.append({"role": msg.role.value, "content": msg.content})
    messages.append({"role": "user", "content": user_content})

    full_content = ""
    try:
        client = get_llm_client()
        stream = await client.chat.completions.create(
            model=settings.llm_chat_model,
            messages=messages,
            stream=True,
            temperature=0.2,
        )

        async for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                full_content += delta
                yield _sse({"type": "token", "content": delta})
    except Exception as exc:
        yield _sse({"type": "error", "message": str(exc)})
        return

    if not full_content.strip():
        yield _sse({"type": "error", "message": "No response generated"})
        return

    assistant_message = ChatMessage(
        session_id=session.id,
        role=MessageRole.assistant,
        content=full_content,
        citations=citations,
    )
    db.add(assistant_message)
    await db.flush()
    await db.commit()
    await db.refresh(assistant_message)

    yield _sse({"type": "citations", "citations": citations})
    yield _sse(
        {
            "type": "done",
            "user_message_id": str(user_message.id),
            "assistant_message_id": str(assistant_message.id),
        }
    )


def _sse(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"
