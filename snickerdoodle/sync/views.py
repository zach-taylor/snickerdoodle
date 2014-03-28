from flask.ext import socketio

from ..videos.models import Video

from ..extensions import db


def video_message(data):
    print data
    socketio.emit('player', data, namespace='/video', broadcast=True)

    # Add the video to the database
    if data['action'] == 'change':
        video = Video(site='', vid=data['id'])
        db.session.add(video)
        db.session.commit()


def attach_views_with_socket(app, socket):
    video_socket = socket.on('video', namespace='/video')
    video_socket(video_message)
