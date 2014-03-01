"""empty message

Revision ID: 19fb7461d42c
Revises: 1abc9e5a3aeb
Create Date: 2014-02-27 10:33:26.554188

"""

# revision identifiers, used by Alembic.
revision = '19fb7461d42c'
down_revision = '1abc9e5a3aeb'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('videos', sa.Column('room_id', sa.Integer(), nullable=True))
    op.add_column('videos', sa.Column('vid', sa.String(length=255), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('videos', 'vid')
    op.drop_column('videos', 'room_id')
    ### end Alembic commands ###