from flask import Flask, render_template, request, jsonify, abort, make_response, current_app, session

from flask.ext import socketio

from ..helpers import insert_user_info

from ..extensions import db


rooms = {}


def create_room(id, user):
    """
    Create a new chat room with the given id and user.

    """

    room = {}

    room['users'] = [user]

    rooms[id] = room
    print rooms


def join_room(id, user):
    """
    Add a user to a chat room with the given id and user, or create one if it doesn't exist

    """

    if id in rooms:
        room = rooms[id]
        room['users'].append(user)
    else:
        create_room(id, user)

    print rooms


def leave_room(id, user):
    """
    Add a user to a chat room with the given id and user, or create one if it doesn't exist

    """

    if id in rooms:
        room = rooms[id]
        room['users'].pop(user)


def clean_rooms():
    """
    Delete all the chat rooms with 0 users.

    """

    to_delete = []

    for id, room in rooms.iteritems():
        if len(room['users']):
            to_delete.append(id)

    for id in to_delete:
        rooms.pop(id)


def on_join(data):
    room = data['room']
    socketio.join_room(room)
    message = {}
    insert_user_info(message)
    join_room(data['room'], message['user_id'])
    socketio.emit('userJoin', message, namespace='/chat', room=room)
    socketio.emit('users', {'users': rooms[room]['users']}, namespace='/chat', room=room)


def on_leave(data):
    room = data['room']
    socketio.leave_room(room)
    message = {}
    insert_user_info(message)
    leave_room(room, message['user_id'])
    socketio.emit('userLeave', message, namespace='/chat', room=room)


def on_connect():
    print 'connected'


def on_disconnect():
    print 'disconnected'


def chat_message(data):
    insert_user_info(data)
    socketio.emit('reply', data, namespace='/chat', room=data['room'])


def attach_views_with_socket(app, socket):
    chat_socket = socket.on('chat', namespace='/chat')
    join_socket = socket.on('join', namespace='/chat')
    leave_socket = socket.on('leave', namespace='/chat')
    connect_socket = socket.on('connect', namespace='/chat')
    disconnect_socket = socket.on('disconnect', namespace='/chat')

    chat_socket(chat_message)
    join_socket(on_join)
    leave_socket(on_leave)
    connect_socket(on_connect)
    disconnect_socket(on_disconnect)
