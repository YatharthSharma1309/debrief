import uuid
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import AsyncSessionLocal
from app.embeddings.openai_embeddings import embed_texts
from app.models import Document, DocumentChunk, DocumentStatus, Workspace
from app.services.chunking import chunk_segments
from app.services.parsing import parse_document
from app.services.storage import delete_document_files, document_storage_dir

MAX_BYTES = settings.max_upload_size_mb * 1024 * 1024


def get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lstrip(".").lower()


def validate_upload(file: UploadFile) -> str:
    if not file.filename:
        raise ValueError("Filename is required")

    file_type = get_file_extension(file.filename)
    if file_type not in settings.allowed_file_types:
        allowed = ", ".join(settings.allowed_file_types)
        raise ValueError(f"Unsupported file type. Allowed: {allowed}")

    return file_type


async def list_documents(db: AsyncSession, workspace: Workspace) -> list[Document]:
    result = await db.execute(
        select(Document)
        .where(Document.workspace_id == workspace.id)
        .order_by(Document.created_at.desc())
    )
    return list(result.scalars().all())


async def get_document(db: AsyncSession, workspace: Workspace, document_id: uuid.UUID) -> Document | None:
    result = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.workspace_id == workspace.id,
        )
    )
    return result.scalar_one_or_none()


async def create_document_record(
    db: AsyncSession,
    workspace: Workspace,
    filename: str,
    file_type: str,
    file_size: int,
    storage_path: str,
) -> Document:
    document = Document(
        workspace_id=workspace.id,
        filename=filename,
        file_type=file_type,
        file_size=file_size,
        storage_path=storage_path,
        status=DocumentStatus.pending,
    )
    db.add(document)
    await db.commit()
    await db.refresh(document)
    return document


async def save_upload_file(
    workspace: Workspace,
    document: Document,
    file: UploadFile,
) -> tuple[str, int]:
    storage_dir = document_storage_dir(str(workspace.id), str(document.id))
    safe_name = Path(file.filename or "upload").name
    destination = storage_dir / safe_name

    content = await file.read()
    file_size = len(content)
    if file_size > MAX_BYTES:
        raise ValueError(f"File exceeds {settings.max_upload_size_mb}MB limit")

    destination.write_bytes(content)
    return str(destination), file_size


async def delete_document(db: AsyncSession, document: Document) -> None:
    delete_document_files(document.storage_path)
    await db.delete(document)
    await db.commit()


async def process_document(document_id: uuid.UUID) -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Document).where(Document.id == document_id))
        document = result.scalar_one_or_none()
        if document is None:
            return

        document.status = DocumentStatus.processing
        document.error_message = None
        await db.commit()

        try:
            segments = parse_document(Path(document.storage_path), document.file_type)
            if not segments:
                raise ValueError(
                    "No extractable text (scanned or image-only PDF — OCR is not supported). "
                    "Export a text PDF or upload as TXT/DOCX."
                )

            chunks = chunk_segments(segments)
            if not chunks:
                raise ValueError("Document produced no chunks after processing")

            embeddings = await embed_texts([chunk.content for chunk in chunks])

            for index, (chunk, embedding) in enumerate(zip(chunks, embeddings, strict=True)):
                db.add(
                    DocumentChunk(
                        document_id=document.id,
                        workspace_id=document.workspace_id,
                        chunk_index=index,
                        content=chunk.content,
                        page_number=chunk.page_number,
                        embedding=embedding,
                    )
                )

            document.status = DocumentStatus.ready
            await db.commit()
        except Exception as exc:
            await db.rollback()
            result = await db.execute(select(Document).where(Document.id == document_id))
            document = result.scalar_one_or_none()
            if document:
                document.status = DocumentStatus.failed
                document.error_message = str(exc)
                await db.commit()
