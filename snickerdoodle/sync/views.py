from flask.ext import socketio

from ..helpers import insert_user_info

from ..videos.models import Video
from ..rooms.models import Room

from ..extensions import db


def on_join(data):
    insert_user_info(data)
    socketio.join_room(data['room'])


def on_leave(data):
    insert_user_info(data)
    socketio.leave_room(data['room'])

def on_connect():
    print 'connected'

def on_disconnect():
    print 'disconnected'


def video_message(data):
    insert_user_info(data)
    socketio.emit('player', data, namespace='/video', broadcast=True, room=data['room'])

    room = Room.query.filter(Room.id == data['room']).first()
    print room.name


    # Add the video to the database
    if data['action'] == 'playlist':
        video = Video(site=data['video']['provider'],
                      vid=data['video']['id'],
                      title=data['video']['title'],
                      icon=data['video']['icon'],
                      room_id=data['room'])
        db.session.add(video)
        db.session.commit()

def attach_views_with_socket(app, socket):
    video_socket = socket.on('video', namespace='/video')
    join_socket = socket.on('join', namespace='/video')
    leave_socket = socket.on('leave', namespace='/video')
    connect_socket = socket.on('connect', namespace='/video')
    disconnect_socket = socket.on('disconnect', namespace='/video')

    video_socket(video_message)
    join_socket(on_join)
    leave_socket(on_leave)
    connect_socket(on_connect)
    disconnect_socket(on_disconnect)
