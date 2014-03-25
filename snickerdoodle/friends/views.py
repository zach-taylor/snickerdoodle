from flask import Flask, render_template, request, jsonify, abort, make_response, current_app
from flask.views import MethodView

from snickerdoodle.lib import facebook

from .models import Video
from ..extensions import db


class FriendSearch(MethodView):

    def get(self):
        q = request.args.get('q', '')

        if not session['user']:
            # TODO: Bettr error for not being logged in
            return 'not logged in'

        access_token = session['access_token']

        graph = facebook.GraphApi(access_token)

        if not q:
            results = {}
        else:
            results = graph.get_graph_info('/me/friendlists', {})

        return jsonify(results=results)


def attach_views(app):
    friend_view = FriendSearch.as_view('friend_api')

    app.add_url_rule('/api/friends/', view_func=friend_search, methods=['GET',])
