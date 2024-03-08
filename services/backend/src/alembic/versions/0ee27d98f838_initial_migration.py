"""Initial migration

Revision ID: 0ee27d98f838
Revises: 
Create Date: 2024-02-27 18:53:43.551359

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0ee27d98f838'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "notes",
        sa.Column("note_uuid", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("contents", sa.String(), nullable=False),
        sa.Column("created", sa.DateTime(timezone=True), nullable=False),
        sa.Column("modified", sa.DateTime(timezone=True)),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('is_public', sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.user_id"], ondelete='CASCADE'
        ),
        sa.PrimaryKeyConstraint("note_uuid"),
    )
    op.create_table(
        "users",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=True, nullable=False),
        sa.PrimaryKeyConstraint("user_id"),
    )
    op.create_index('ix_users_username', 'users', ['username'])
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_users_is_active', 'users', ['is_active'])
    op.create_index('ix_notes_title', 'notes', ['title'])
    op.create_index('ix_notes_created', 'notes', ['created'])
    op.create_index('ix_notes_is_public', 'notes', ['is_public'])
    # ### end Alembic commands ###

def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_users_username')
    op.drop_index('ix_users_email')
    op.drop_index('ix_users_is_active')
    op.drop_index('ix_notes_title')
    op.drop_index('ix_notes_created')
    op.drop_index('ix_notes_is_public')
    op.drop_table("notes")
    op.drop_table("users")
    # ### end Alembic commands ###