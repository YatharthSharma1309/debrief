import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_owned_workspace
from app.database import get_db
from app.models import Workspace
from app.schemas.document import DocumentResponse
from app.services import document as document_service

router = APIRouter(prefix="/workspaces/{workspace_id}/documents")


@router.get("", response_model=list[DocumentResponse])
async def list_documents(
    workspace: Workspace = Depends(get_owned_workspace),
    db: AsyncSession = Depends(get_db),
):
    return await document_service.list_documents(db, workspace)


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    background_tasks: BackgroundTasks,
    workspace: Workspace = Depends(get_owned_workspace),
    db: AsyncSession = Depends(get_db),
    file: UploadFile = File(...),
):
    try:
        file_type = document_service.validate_upload(file)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    document = await document_service.create_document_record(
        db=db,
        workspace=workspace,
        filename=file.filename or "upload",
        file_type=file_type,
        file_size=0,
        storage_path="",
    )

    try:
        storage_path, file_size = await document_service.save_upload_file(workspace, document, file)
        document.storage_path = storage_path
        document.file_size = file_size
        await db.commit()
        await db.refresh(document)
    except ValueError as exc:
        await document_service.delete_document(db, document)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except Exception as exc:
        await document_service.delete_document(db, document)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save file",
        ) from exc

    background_tasks.add_task(document_service.process_document, document.id)
    return document


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: uuid.UUID,
    workspace: Workspace = Depends(get_owned_workspace),
    db: AsyncSession = Depends(get_db),
):
    document = await document_service.get_document(db, workspace, document_id)
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return document


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: uuid.UUID,
    workspace: Workspace = Depends(get_owned_workspace),
    db: AsyncSession = Depends(get_db),
):
    document = await document_service.get_document(db, workspace, document_id)
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    await document_service.delete_document(db, document)
