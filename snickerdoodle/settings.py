import os
_basedir = os.path.abspath(os.path.dirname(__file__))

if 'DEPLOY' in os.environ and os.environ['DEPLOY']:
    DEPLOYED = True
else:
    DEPLOYED = False

#
# Flask Settings
#

DEBUG = True
SECRET_KEY = '512d190ec56d834bc3bb86aa29414bf3319cf8ab'

#
# Database Settings
#

if not os.environ.has_key('DATABASE_URL'):
    os.environ['DATABASE_URL'] = 'postgres://postgres:fishing2@localhost/snickerdoodle'
SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']

#
# Facebook API Settings
#

from snickerdoodle.lib import facebook

# Facebook OAuth variables
FACEBOOK_APP_ID = '1409850522596219'
FACEBOOK_APP_SECRET = '48ddba88b37cb401f5759b6fec211b61'
FACEBOOK_CLIENT_SECRET = '3e5a7c9e3ae3e219f468dac0d90ee3a0'

if DEPLOYED:
    FACEBOOK_OAUTH_REDIRECT = 'http://snicker-doodle.herokuapp.com/oauth'
else:
    FACEBOOK_OAUTH_REDIRECT = 'http://localhost:5000/oauth'


facebook.configure(FACEBOOK_APP_ID,
                   FACEBOOK_APP_SECRET,
                   FACEBOOK_OAUTH_REDIRECT)

#
# YouTube Data API
#

from snickerdoodle.lib import youtube

DEVELOPER_KEY = "AIzaSyBPDbLcke_kIARBVWh9BZnY110bnKqEPDA"

youtube.configure(DEVELOPER_KEY)

#
# WTForm Settings
#

WTF_CSRF_ENABLED = False

try:
    from settingslocal import *
except ImportError:
    pass
