from flask.ext import socketio
from flask import session

from ..videos.models import Video

from ..extensions import db


def video_message(data):
    print data
    data['username'] = session['user']['name']
    data['user_id'] = session['user']['id']
    socketio.emit('player', data, namespace='/video', broadcast=True)

    # Add the video to the database
    if data['action'] == 'playlist':
        video = Video(site=data['site'], vid=data['id'])
        db.session.add(video)
        db.session.commit()


def attach_views_with_socket(app, socket):
    video_socket = socket.on('video', namespace='/video')
    video_socket(video_message)
