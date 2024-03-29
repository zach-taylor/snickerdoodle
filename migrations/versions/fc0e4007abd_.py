"""empty message

Revision ID: fc0e4007abd
Revises: 3272e4564f32
Create Date: 2014-03-08 22:10:09.944267

"""

# revision identifiers, used by Alembic.
revision = 'fc0e4007abd'
down_revision = '3272e4564f32'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('oauth_token', sa.String(length=255), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'oauth_token')
    ### end Alembic commands ###
