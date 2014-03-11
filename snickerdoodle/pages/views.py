from flask import Flask, render_template, jsonify, session, request, url_for, redirect

from snickerdoodle import helpers

#
# Main Views
#


def home():
    context = helpers.default_context()

    return render_template('home.html', **context)


def home2():
    context = helpers.default_context()

    return render_template('home2.html', **context)


def connect():
    context = helpers.default_context()

    return render_template('connect.html', **context)


def watch():
    context = helpers.default_context()

    return render_template('watch.html', **context)

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
    app.add_url_rule('/home2', view_func=home2)
    app.add_url_rule('/connect', view_func=connect)
    app.add_url_rule('/watch', view_func=watch)
    app.add_url_rule('/chat', view_func=chat)
    app.add_url_rule('/chat2', view_func=chat2)

