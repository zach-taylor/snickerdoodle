import os
_basedir = os.path.abspath(os.path.dirname(__file__))

#
# Flask Settings
#

DEBUG = True
SECRET_KEY = '512d190ec56d834bc3bb86aa29414bf3319cf8ab'

#
# Database Settings
#


SQLALCHEMY_DATABASE_URI = 'postgres://postgres@localhost/snickerdoodle'

#
# Facebook API Settings
#

from snickerdoodle.lib import facebook

# Facebook OAuth variables
FACEBOOK_APP_ID = '1409850522596219'
FACEBOOK_APP_SECRET = '48ddba88b37cb401f5759b6fec211b61'
FACEBOOK_CLIENT_SECRET = '3e5a7c9e3ae3e219f468dac0d90ee3a0'
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
