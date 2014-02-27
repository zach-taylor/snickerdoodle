from os import path

from flask import Flask, render_template, request, jsonify, abort, make_response
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.script import Manager
from flask.ext.migrate import Migrate, MigrateCommand

BASE = path.join(path.dirname(path.abspath(__file__)), '..')
TEMPLATE_DIR = path.join(BASE, 'templates')
STATIC_DIR = path.join(BASE, 'static')

snickerdoodle = Flask(__name__,
                      template_folder=TEMPLATE_DIR,
                      static_folder=STATIC_DIR)

snickerdoodle.config.from_pyfile('settings.py')

db = SQLAlchemy(snickerdoodle)
migrate = Migrate(snickerdoodle, db)
manager = Manager(snickerdoodle)
manager.add_command('db', MigrateCommand)

from users.models import User
from rooms.models import Room
from videos.models import Video

@snickerdoodle.errorhandler(400)
def bad_request(error):
    return make_response(jsonify( { 'error': 'Bad request' } ), 400)

@snickerdoodle.errorhandler(404)
def not_found(error):
    return make_response(jsonify( { 'error': 'Not found' } ), 404)

@snickerdoodle.errorhandler(500)
def internal_server_error(error):
    return make_response(jsonify( { 'error': 'Internal server error' } ), 500)

@snickerdoodle.route('/')
def hello():
    return render_template('home.html')


@snickerdoodle.route('/connect')
def connect():
    return render_template('connect.html')


@snickerdoodle.route('/video')
def video():
    return render_template('video.html')


@snickerdoodle.route('/user', methods=['PUT', 'POST'])
def new_user():
    if not request.json or not 'user' in request.json:
        abort(400)
    try:
        data = request.get_json(force=True)
        user = User(data['user']['fb_id'])
        db.session.add(user)
        db.session.commit()
    except Exception, e:
        snickerdoodle.logger.warning(e)
        abort(500)

    user_json = {
        'id': user.id,
        'fb_id': user.fb_id
    }

    return jsonify( { 'user': user_json } ), 201


@snickerdoodle.route('/room', methods=['PUT', 'POST'])
def new_room():
    if not request.json or not 'room' in request.json:
            abort(400)
    try:
        data = request.get_json(force=True)
        room = Room(data['room']['name'], data['room']['host_id'])
        db.session.add(room)
        db.session.commit()
    except Exception, e:
        snickerdoodle.logger.warning(e)
        abort(500)

    room_json = {
        'id': room.id,
        'name': room.name,
        'host_id': room.host_id
    }

    return jsonify( { 'room': room_json } ), 201

@snickerdoodle.route('/room/<room_id>', methods=['GET'])
def get_room(room_id):
    try:
        room = Room.query.filter(Room.id == room_id).first()
    except Exception, e:
        snickerdoodle.logger.warning(e)
        abort(500)

    room_json = {
        'id': room.id,
        'name': room.name,
        'host_id': room.host_id
    }

    return jsonify( {'room': room_json} )

@snickerdoodle.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.filter(User.id == user_id).first()
    except Exception, e:
        snickerdoodle.logger.warning(e)
        abort(500)

    user_json = {
        'id': user.id,
        'fb_id': user.fb_id
    }

    return jsonify( {'user': user_json} )