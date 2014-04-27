from flask.ext import socketio

from ..helpers import insert_user_info

from ..videos.models import Video

from ..chat.views import rooms, create_room

from ..extensions import db

def on_join(data):
    insert_user_info(data)
    room_id = 36
    if rooms[room_id]:
        socketio.join_room(room_id)
        message = {'data': data['username'] + ' joined the room!'}
        socketio.emit('reply', message, namespace='/chat', room=room_id)
    else:
        create_room(room_id, data['user_id'])


def on_leave(data):
    insert_user_info(data)
    room_id = 36
    if rooms[room_id]:
        socketio.leave_room(room_id)
        message = {'data': data['username'] + ' left the room!'}
        socketio.emit('reply', message, namespace='/chat', room=room_id)


def video_message(data):
    room = 36
    insert_user_info(data)
    socketio.emit('player', data, namespace='/video', broadcast=True, room=room)

    # Add the video to the database
    if data['action'] == 'playlist':
        video = Video(site=data['video']['provider'], vid=data['video']['id'], title=data['video']['title'], icon=data['video']['icon'])
        db.session.add(video)
        db.session.commit()

def attach_views_with_socket(app, socket):
    video_socket = socket.on('video', namespace='/video')
    join_socket = socket.on('join', namespace='/video')
    leave_socket = socket.on('leave', namepsace='/video')

    video_socket(video_message)
    join_socket(on_join)
    leave_socket(on_leave)