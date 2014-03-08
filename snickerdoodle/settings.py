import os
_basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG_MODE = True
SQLALCHEMY_DATABASE_URI = 'postgres://postgres@localhost/snickerdoodle'

#Facebook OAuth variables
OAUTH_CONSUMER_KEY = os.environ.get('OAUTH_CONSUMER_KEY', '')
OAUTH_CONSUMER_SECRET = os.environ.get('OAUTH_CONSUMER_SECRET', '')

WTF_CSRF_ENABLED = False

try:
    from settingslocal import *
except ImportError:
    pass
