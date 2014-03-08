from .settings import OAUTH_CONSUMER_KEY, OAUTH_CONSUMER_SECRET

from flask.ext.sqlalchemy import SQLAlchemy
db = SQLAlchemy()

from flask.ext.oauth import OAuth
oauth = OAuth()
facebook = oauth.remote_app('facebook',
    base_url='https://graph.facebook.com/',
    request_token_url=None,
    access_token_url='/oauth/access_token',
    authorize_url='https://www.facebook.com/dialog/oauth',
    consumer_key=OAUTH_CONSUMER_KEY,
    consumer_secret=OAUTH_CONSUMER_SECRET,
    request_token_params={'scope': 'email'}
)