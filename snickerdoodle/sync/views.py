from flask.ext import socketio


def video_message(data):
    print data
    socketio.emit('player', data, namespace='/video', broadcast=True)


def attach_views_with_socket(app, socket):
    video_socket = socket.on('video', namespace='/video')
    video_socket(video_message)
