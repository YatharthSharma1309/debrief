from app.rag.retrieval import RetrievedChunk


def build_rag_system_prompt(chunks: list[RetrievedChunk]) -> str:
    if not chunks:
        return (
            "You are Debrief, a decision assistant grounded in the user's uploaded files. "
            "No relevant document passages were found for this question. "
            "Do NOT invent facts. Tell the user to upload documents or rephrase their question, "
            "and mention that answers must come from their workspace sources."
        )

    context_blocks = []
    for index, chunk in enumerate(chunks, start=1):
        page = f", page {chunk.page_number}" if chunk.page_number else ""
        context_blocks.append(
            f"[Source {index}] {chunk.filename}{page}\n{chunk.content}"
        )

    context = "\n\n".join(context_blocks)

    return f"""You are Debrief, an intelligent decision-brief assistant.

Answer the user's question using ONLY the provided document excerpts below.
If the excerpts do not contain enough information, say so clearly.
Cite sources inline using [Source N] notation matching the excerpts below.
Prefer concise answers that identify decisions, rationale, owners, risks, open questions, and next actions when relevant.

Document excerpts:
{context}"""
