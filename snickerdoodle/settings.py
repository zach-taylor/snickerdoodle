import os
_basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG_MODE = True
SQLALCHEMY_DATABASE_URI = 'postgres://postgres@localhost/snickerdoodle'

#Facebook OAuth variables
#OAUTH_CONSUMER_KEY = os.environ['OAUTH_CONSUMER_KEY']
#OAUTH_CONSUMER_SECRET = os.environ['OAUTH_CONSUMER_SECRET']

try:
    from settingslocal import *
except ImportError:
    pass
