"""Add persisted decision brief to workspaces

Revision ID: 002_decision_brief
Revises: 001_initial
Create Date: 2026-07-14
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "002_decision_brief"
down_revision: Union[str, None] = "001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "workspaces",
        sa.Column("decision_brief", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )
    op.add_column(
        "workspaces",
        sa.Column("decision_brief_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("workspaces", "decision_brief_at")
    op.drop_column("workspaces", "decision_brief")
