"""Widen embedding vectors for OpenRouter free Nemotron embeddings (2048-d).

Revision ID: 003_embedding_2048
Revises: 002_decision_brief
Create Date: 2026-07-14
"""

from typing import Sequence, Union

from alembic import op

revision: str = "003_embedding_2048"
down_revision: Union[str, None] = "002_decision_brief"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("UPDATE document_chunks SET embedding = NULL")
    op.execute(
        "ALTER TABLE document_chunks "
        "ALTER COLUMN embedding TYPE vector(2048) USING embedding::vector(2048)"
    )


def downgrade() -> None:
    op.execute("UPDATE document_chunks SET embedding = NULL")
    op.execute(
        "ALTER TABLE document_chunks "
        "ALTER COLUMN embedding TYPE vector(1536) USING embedding::vector(1536)"
    )
