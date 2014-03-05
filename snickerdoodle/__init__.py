from os import path

from flask import Flask, render_template, jsonify
from flask.ext.script import Manager
from flask.ext.migrate import Migrate, MigrateCommand
from flask.ext.socketio import SocketIO, emit

from .extensions import db

from .videos import views as videos_views
from .rooms import views as rooms_views
from .users import views as users_views
from .friends.models import Friend


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
socketio = SocketIO(snickerdoodle)

manager.add_command('db', MigrateCommand)

videos_views.attach_views(snickerdoodle)
rooms_views.attach_views(snickerdoodle)
users_views.attach_views(snickerdoodle)

# @snickerdoodle.errorhandler(400)
# def bad_request(error):
#     return make_response(jsonify( { 'error': 'Bad request' } ), 400)
#
# @snickerdoodle.errorhandler(404)
# def not_found(error):
#     return make_response(jsonify( { 'error': 'Not found' } ), 404)
#
# @snickerdoodle.errorhandler(500)
# def internal_server_error(error):
#     return make_response(jsonify( { 'error': 'Internal server error' } ), 500)

@snickerdoodle.route('/')
def hello():
    return render_template('home.html')

@snickerdoodle.route('home2')
def testhome():
    return render_template('home2.html')

@snickerdoodle.route('/connect')
def connect():
    return render_template('connect.html')


@snickerdoodle.route('/watch')
def video():
    return render_template('watch.html')

@socketio.on('watch', namespace='/watch')
def test_message(message):
    print message
    emit('player', message, namespace='/watch', broadcast=True)

