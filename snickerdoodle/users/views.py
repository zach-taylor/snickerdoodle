from flask import Flask, render_template, request, jsonify, abort, make_response, current_app, session
from flask.views import MethodView

from snickerdoodle.lib import facebook

from .models import User
from ..extensions import db

class UserAPI(MethodView):

    def get(self, user_id):
        if user_id is None:
            # return a list of users
            pass
        else:
            # expose a single user
            try:
                user = User.query.filter(User.id == user_id).first()
            except Exception, e:
                current_app.logger.warning(e)
                abort(500)

            friends_array = []

            for f in user.friends:
                friend_json = {
                    'id': f.id,
                    'fb_id': f.fb_id,
                    'display_name': f.display_name
                }
                friends_array.append(friend_json)

            user_json = {
                'id': user.id,
                'fb_id': user.fb_id,
                'display_name': user.display_name,
                'friends': friends_array
            }

            return jsonify( {'user': user_json} )

    def post(self):
        # create a new user
        if not request.json or not 'user' in request.json:
            abort(400)
        try:
            data = request.get_json(force=True)
            user = User(data['user']['fb_id'])
            db.session.add(user)
            db.session.commit()
        except Exception, e:
            current_app.logger.warning(e)
            abort(500)

        user_json = {
            'id': user.id,
            'fb_id': user.fb_id
        }

        return jsonify( { 'user': user_json } ), 201

    def delete(self, user_id):
        # delete a single user
        pass

    def put(self, user_id):
        # update a single user
        pass

class FriendSearch(MethodView):

    def get(self):
        if not session['user']:
            # TODO: Bettr error for not being logged in
            return 'not logged in'

        access_token = session['access_token']

        graph = facebook.GraphApi(access_token)

        results = graph.get_graph_info('/me/friends', {})

        return jsonify(results=results)

class FriendAPI(MethodView):
    def get(self, friend_id):
        if not session['user']:
            return 'not logged in'

        try:
            user = User.query.filter(User.id == session['user_id']).first()
            friend = User.query.filter(User.fb_id == friend_id).first()
        except Exception, e:
            current_app.logger.warning(e)
            abort(500)

        friendship = {
            'user_id': user.id,
            'friend_id': friend.id,
            'status': user.is_friend(friend)
        }

        return jsonify({'friend': friendship}), 200

    def post(self):
        if not session['user']:
            return 'not logged in'

        try:
            data = request.get_json(force=True)
            user = User.query.filter(User.id == session['user_id']).first()
            friend = User.query.filter(User.fb_id == data['user']['fb_id']).first()
            user.friend(friend)
        except Exception, e:
            current_app.logger.warning(e)
            abort(500)

        return jsonify({'result': True}), 201

    def put(self, friend_id):
        pass

    def delete(self, friend_id):
        if not session['user']:
            return 'not logged in'

        try:
            user = User.query.filter(User.id == session['user_id']).first()
            friend = User.query.filter(User.fb_id == friend_id).first()
            user.unfriend(friend)
        except Exception, e:
            current_app.logger.warning(e)
            abort(500)

        return jsonify({ 'result': True }), 204


def attach_views(app):
    #
    # Users API
    #
    user_api = UserAPI.as_view('user_api')
    app.add_url_rule('/api/users', defaults={'user_id': None},
                                view_func=user_api, methods=['GET',])
    app.add_url_rule('/api/users', view_func=user_api, methods=['POST',])
    app.add_url_rule('/api/users/<int:user_id>', view_func=user_api,
                                methods=['GET', 'PUT', 'DELETE'])

    #
    # Friends API
    #

    friend_view = FriendSearch.as_view('friend_search')

    app.add_url_rule('/users/friends/', view_func=friend_view, methods=['GET',])

    friend_api = FriendAPI.as_view('friend_api')
    app.add_url_rule('/api/friends', view_func=friend_api, methods=['POST'])
    app.add_url_rule('/api/friends/<string:friend_id>', view_func=friend_api, methods=['GET', 'DELETE'])
