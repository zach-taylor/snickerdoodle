from flask import jsonify, redirect, request, session

from snickerdoodle.lib import facebook

from snickerdoodle.users.models import User

#
# Auth Views
#


def login():
    return redirect(facebook.dialog_url())


def oauth_callback():
    code = request.args['code']
    access_token = facebook.access_token(code)

    graph = facebook.GraphApi(access_token)

    info = graph.get_graph_info('/me', {})

    # First check to see if the user is already in the DB
    user = User.query.get(info['id'])

    if not user:
        # Create User Model
        user = User(id=info['id'], fb_username=info['username'], oauth_token=access_token)
        user.display_name = '{0} {1}'.format(info['first_name'], info['last_name'])

        # Add and Commit User
        User.add_user(user)
        User.commit()
    else:
        # Just update the OAuth
        user.oauth_token = access_token

        # Commit the new OAuth
        User.commit()

    if access_token is not None:
        print 'Access Token:', access_token
        session['user'] = info
        session['user_id'] = user.id
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
