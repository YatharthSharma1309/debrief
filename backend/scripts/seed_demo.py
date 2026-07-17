"""Seed the OpenAI Build Week demo account and sample workspaces."""

from __future__ import annotations

import asyncio
import os
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

WORKSPACES: list[dict[str, str | Path]] = [
    {
        "name": "Launch Planning",
        "description": "Pre-seeded Build Week demo: pricing decision, owners, risks, date conflicts.",
        "examples_dir": REPO / "examples" / "launch-planning",
    },
    {
        "name": "Vendor Renewal",
        "description": "Acme vs Beacon tools renewals — ₹ cap, competing quote, SSO tradeoff.",
        "examples_dir": REPO / "examples" / "vendor-renewal",
    },
    {
        "name": "Hiring Panel",
        "description": "Senior backend hire — INR band, deferred level, competing offer deadline.",
        "examples_dir": REPO / "examples" / "hiring-panel",
    },
]

KEEP_NAMES = {str(w["name"]) for w in WORKSPACES}

FORCE_REFRESH = "--force" in sys.argv or os.environ.get("SEED_FORCE_REFRESH", "").lower() in {
    "1",
    "true",
    "yes",
}


async def seed_workspace(db, user: User, spec: dict[str, str | Path]) -> None:
    name = str(spec["name"])
    description = str(spec["description"])
    examples_dir = Path(spec["examples_dir"])

    if not examples_dir.exists():
        raise SystemExit(f"Missing demo docs at {examples_dir}")

    result = await db.execute(
        select(Workspace).where(Workspace.user_id == user.id, Workspace.name == name)
    )
    workspace = result.scalar_one_or_none()
    if workspace is None:
        workspace = Workspace(user_id=user.id, name=name, description=description)
        db.add(workspace)
        await db.commit()
        await db.refresh(workspace)
        print(f"Created workspace {name}")
    else:
        workspace.description = description
        await db.commit()
        print(f"Using existing workspace {name}")

    txt_files = sorted(examples_dir.glob("*.txt"))
    if not txt_files:
        raise SystemExit(f"No .txt demo files found in {examples_dir}")

    for path in txt_files:
        result = await db.execute(
            select(Document).where(
                Document.workspace_id == workspace.id,
                Document.filename == path.name,
            )
        )
        existing = result.scalar_one_or_none()
        if existing and existing.status == DocumentStatus.ready and not FORCE_REFRESH:
            print(f"  Skip ready: {path.name}")
            continue

        if existing:
            print(f"  Refreshing: {path.name}")
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

        print(f"  Processing {path.name}...")
        await process_document(document.id)

    await db.refresh(workspace)
    result = await db.execute(
        select(Document).where(
            Document.workspace_id == workspace.id,
            Document.status == DocumentStatus.ready,
        )
    )
    ready_docs = list(result.scalars().all())
    print(f"  Ready documents: {len(ready_docs)}")

    if ready_docs:
        try:
            brief = await generate_workspace_summary(db, workspace)
            print(f"  Decision brief generated ({len(brief.key_decisions)} decisions)")
        except Exception as exc:
            print(f"  Brief generation skipped/failed: {exc}")


async def seed() -> None:
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

        result = await db.execute(select(Workspace).where(Workspace.user_id == user.id))
        for workspace in list(result.scalars().all()):
            if workspace.name not in KEEP_NAMES:
                print(f"Removing junk workspace: {workspace.name!r}")
                await db.delete(workspace)
        await db.commit()

        for spec in WORKSPACES:
            print(f"\n=== {spec['name']} ===")
            await seed_workspace(db, user, spec)

        print("\nDemo ready:")
        print(f"  Email:    {DEMO_EMAIL}")
        print(f"  Password: {DEMO_PASSWORD}")
        print(f"  Workspaces: {', '.join(sorted(KEEP_NAMES))}")


if __name__ == "__main__":
    asyncio.run(seed())
