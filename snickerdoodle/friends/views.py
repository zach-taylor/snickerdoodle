from flask import Flask, render_template, request, jsonify, abort, make_response, current_app, session
from flask.views import MethodView

from snickerdoodle.settings import FACEBOOK_APP_ID
from snickerdoodle.lib import facebook


class FriendSearch(MethodView):
    """
    Allows searching of the Facebook Graph for friends of a user.

    """

    def get(self):
        if 'user' not in session:
            # TODO: Bettr error for not being logged in
            return 'not logged in'

        access_token = session['access_token']

        graph = facebook.GraphApi(access_token)

        results = graph.get_graph_info('/me/friends', {})

        return jsonify(results=results)


class FriendInvite(MethodView):
    """
    Sends out via a chat notification to specific people requesting for them to
    join the Room.

    """

    def post(self):
        if not session['user']:
            # TODO: Bettr error for not being logged in
            return 'not logged in'

        print request.form

        if 'receiver' in request.form:
            receiver = request.form.get('receiver')
        else:
            # TODO: Bettr error for not being logged in
            return 'no receivers found'

        if 'mesg' in request.form:
            mesg = request.form.get('mesg')
        else:
            # TODO: Bettr error for not being logged in
            return 'no mesg found'

        username = session['user']['id']

        # Send to yourself for test purposes
        receiver = username

        # Facebook credentials
        token = session['access_token'][0]
        key = FACEBOOK_APP_ID

        facebook.send_message(token, key, username, mesg, receiver)

        return jsonify(result='success')


def attach_views(app):
    #
    # Friends
    #

    search = FriendSearch.as_view('friend_search')
    app.add_url_rule('/friends/', view_func=search, methods=['GET',])

    invite = FriendInvite.as_view('friend_invite')
    app.add_url_rule('/friends/invite/', view_func=invite, methods=['POST',])
