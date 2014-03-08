from flask import jsonify, redirect, request, session

from snickerdoodle import facebook

#
# Auth Views
#


def login():
    return jsonify(dialog_url=facebook.dialog_url())


def oauth_callback():
    code = request.args['code']
    access_token = facebook.access_token(code)

    if access_token is not None:
        print 'Access Token:', access_token
        session['user'] = True
        session['access_token'] = access_token
    else:
        print 'Access Token is None'

    return redirect('/')


def logout():
    pass


#
# Routing + Views
#

def attach_views(app):
    print "Attaching login views"

    app.add_url_rule('/login', view_func=login)
    app.add_url_rule('/oauth', view_func=oauth_callback)
