from flask import Flask, render_template, jsonify, session, request, url_for, redirect

from snickerdoodle import helpers

#
# Main Views
#


def home():
    context = helpers.default_context()
    context['room_name'] = helpers.generate_room_name()

    return render_template('home.html', **context)


def connect():
    context = helpers.default_context()

    return render_template('connect.html', **context)


def chat():
    context = helpers.default_context()

    return render_template('chat.html', **context)


def chat2():
    context = helpers.default_context()

    return render_template('index.html', **context)


#
# Routing + Views
#

def attach_views(app):
    app.add_url_rule('/', view_func=home)
    app.add_url_rule('/home', view_func=home)
    app.add_url_rule('/connect', view_func=connect)
    app.add_url_rule('/chat', view_func=chat)
    app.add_url_rule('/chat2', view_func=chat2)

