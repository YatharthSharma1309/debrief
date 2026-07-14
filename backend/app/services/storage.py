from pathlib import Path

from app.config import settings


def ensure_upload_dir() -> Path:
    path = Path(settings.upload_dir)
    path.mkdir(parents=True, exist_ok=True)
    return path


def document_storage_dir(workspace_id: str, document_id: str) -> Path:
    path = ensure_upload_dir() / workspace_id / document_id
    path.mkdir(parents=True, exist_ok=True)
    return path


def delete_document_files(storage_path: str) -> None:
    if not storage_path:
        return
    file_path = Path(storage_path)
    if file_path.is_file():
        file_path.unlink()
    elif file_path.exists():
        return
    parent = file_path.parent
    if parent.exists() and not any(parent.iterdir()):
        parent.rmdir()
        grandparent = parent.parent
        if grandparent.exists() and not any(grandparent.iterdir()):
            grandparent.rmdir()
