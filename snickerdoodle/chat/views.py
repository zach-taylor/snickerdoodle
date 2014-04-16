from flask import Flask, render_template, request, jsonify, abort, make_response, current_app, session

from flask.ext import socketio

rooms = {}


def create_room(id, user):
    """
    Create a new chat room with the given id and user.

    """

    room = {}

    room['users'] = [user]
    room['sockets'] = []

    rooms[id] = room


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


def chat_message(data):
    data['username'] = session['user']['name']
    data['user_id'] = session['user']['id']
    print data
    socketio.emit('reply', data, namespace='/chat', broadcast=True)


def attach_views_with_socket(app, socket):
    chat_socket = socket.on('chat', namespace='/chat', broadcast=True)
    chat_socket(chat_message)
    

