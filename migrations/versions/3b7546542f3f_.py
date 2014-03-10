"""empty message

Revision ID: 3b7546542f3f
Revises: 26398cf99dbf
Create Date: 2014-03-10 02:11:00.251870

"""

# revision identifiers, used by Alembic.
revision = '3b7546542f3f'
down_revision = '26398cf99dbf'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('friends', sa.Column('friend_id', sa.Integer(), nullable=True))
    op.add_column('friends', sa.Column('user_id', sa.Integer(), nullable=True))
    op.drop_column('friends', 'friendee_id')
    op.drop_column('friends', 'friender_id')
    op.drop_column('friends', 'id')
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('friends', sa.Column('id', sa.INTEGER(), server_default="nextval('friends_id_seq'::regclass)", nullable=False))
    op.add_column('friends', sa.Column('friender_id', sa.INTEGER(), nullable=True))
    op.add_column('friends', sa.Column('friendee_id', sa.INTEGER(), nullable=True))
    op.drop_column('friends', 'user_id')
    op.drop_column('friends', 'friend_id')
    ### end Alembic commands ###
