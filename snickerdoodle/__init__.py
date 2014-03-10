from os import path

from flask import Flask, render_template, jsonify, session, request, url_for, redirect

from flask.ext import socketio
from flask.ext.migrate import Migrate, MigrateCommand
from flask.ext.script import Manager

from .extensions import db

from .auth import views as auth_views
from .pages import views as main_views
from .rooms import views as rooms_views
from .users import views as users_views
from .videos import views as videos_views

# SocketIO Views
from .sync import views as sync_views
from .chat import views as chat_views


BASE = path.join(path.dirname(path.abspath(__file__)), '..')
TEMPLATE_DIR = path.join(BASE, 'templates')
STATIC_DIR = path.join(BASE, 'static')

snickerdoodle = Flask(__name__,
                      template_folder=TEMPLATE_DIR,
                      static_folder=STATIC_DIR)

snickerdoodle.config.from_pyfile('settings.py')

db.init_app(snickerdoodle)

migrate = Migrate(snickerdoodle, db)
manager = Manager(snickerdoodle)
socket = socketio.SocketIO(snickerdoodle)

manager.add_command('db', MigrateCommand)

#
# Attach Views
#

auth_views.attach_views(snickerdoodle)
main_views.attach_views(snickerdoodle)
rooms_views.attach_views(snickerdoodle)
users_views.attach_views(snickerdoodle)
videos_views.attach_views(snickerdoodle)

#
# Socket Views
#

chat_views.attach_views_with_socket(snickerdoodle, socket)
sync_views.attach_views_with_socket(snickerdoodle, socket)
