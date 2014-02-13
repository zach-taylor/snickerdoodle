import os
_basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG_MODE = True
SQLALCHEMY_DATABASE_URI = 'postgres://postgres@localhost/snickerdoodle'

try:
    from settingslocal import *
except ImportError:
    pass
