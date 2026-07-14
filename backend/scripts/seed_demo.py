"""Seed the OpenAI Build Week demo account and Launch Planning workspace."""

from __future__ import annotations

import asyncio
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parent
sys.path.insert(0, str(ROOT))

from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models import Document, DocumentStatus, User, Workspace
from app.services.document import process_document
from app.services.security import hash_password
from app.services.storage import document_storage_dir
from app.services.summary import generate_workspace_summary

DEMO_EMAIL = "demo@debrief.app"
DEMO_PASSWORD = "DemoBuildWeek2026!"
DEMO_NAME = "Build Week Judge"
WORKSPACE_NAME = "Launch Planning"
EXAMPLES_DIR = REPO / "examples" / "launch-planning"


async def seed() -> None:
    if not EXAMPLES_DIR.exists():
        raise SystemExit(f"Missing demo docs at {EXAMPLES_DIR}")

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == DEMO_EMAIL))
        user = result.scalar_one_or_none()
        if user is None:
            user = User(
                email=DEMO_EMAIL,
                hashed_password=hash_password(DEMO_PASSWORD),
                full_name=DEMO_NAME,
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
            print(f"Created user {DEMO_EMAIL}")
        else:
            user.hashed_password = hash_password(DEMO_PASSWORD)
            user.full_name = DEMO_NAME
            await db.commit()
            print(f"Updated password for {DEMO_EMAIL}")

        result = await db.execute(
            select(Workspace).where(Workspace.user_id == user.id, Workspace.name == WORKSPACE_NAME)
        )
        workspace = result.scalar_one_or_none()
        if workspace is None:
            workspace = Workspace(
                user_id=user.id,
                name=WORKSPACE_NAME,
                description="Pre-seeded Build Week demo: pricing decision, owners, risks, date conflicts.",
            )
            db.add(workspace)
            await db.commit()
            await db.refresh(workspace)
            print(f"Created workspace {WORKSPACE_NAME}")
        else:
            print(f"Using existing workspace {WORKSPACE_NAME}")

        txt_files = sorted(EXAMPLES_DIR.glob("*.txt"))
        if not txt_files:
            raise SystemExit("No .txt demo files found in examples/launch-planning")

        document_ids: list = []
        for path in txt_files:
            result = await db.execute(
                select(Document).where(
                    Document.workspace_id == workspace.id,
                    Document.filename == path.name,
                )
            )
            existing = result.scalar_one_or_none()
            if existing and existing.status == DocumentStatus.ready:
                print(f"Skip ready: {path.name}")
                continue

            if existing:
                await db.delete(existing)
                await db.commit()

            content = path.read_bytes()
            document = Document(
                workspace_id=workspace.id,
                filename=path.name,
                file_type="txt",
                file_size=len(content),
                storage_path="",
                status=DocumentStatus.pending,
            )
            db.add(document)
            await db.commit()
            await db.refresh(document)

            storage_dir = document_storage_dir(str(workspace.id), str(document.id))
            destination = storage_dir / path.name
            shutil.copy2(path, destination)
            document.storage_path = str(destination)
            await db.commit()

            print(f"Processing {path.name}...")
            await process_document(document.id)
            document_ids.append(document.id)

        await db.refresh(workspace)
        result = await db.execute(
            select(Document).where(
                Document.workspace_id == workspace.id,
                Document.status == DocumentStatus.ready,
            )
        )
        ready_docs = list(result.scalars().all())
        print(f"Ready documents: {len(ready_docs)}")

        if ready_docs:
            try:
                brief = await generate_workspace_summary(db, workspace)
                print(f"Decision brief generated ({len(brief.key_decisions)} decisions)")
            except Exception as exc:
                print(f"Brief generation skipped/failed: {exc}")

        print("\nDemo ready:")
        print(f"  Email:    {DEMO_EMAIL}")
        print(f"  Password: {DEMO_PASSWORD}")
        print(f"  Workspace: {WORKSPACE_NAME}")


if __name__ == "__main__":
    asyncio.run(seed())
