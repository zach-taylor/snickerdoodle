from flask import Flask, render_template, request, jsonify, abort, make_response, current_app, session
from flask.views import MethodView

from .models import User
from ..extensions import db

class UserAPI(MethodView):

    def get(self):
        # expose a single user and friends
        try:
            user = User.query.filter(User.id == session['user_id']).first()
        except Exception, e:
            current_app.logger.warning(e)
            abort(500)

        friends_array = []

        for f in user.friends:
            friend_json = {
                'id': f.id,
                'display_name': f.display_name
            }
            friends_array.append(friend_json)

        user_json = {
            'id': user.id,
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
            user = User(id=data['user']['id'])
            db.session.add(user)
            db.session.commit()
        except Exception, e:
            current_app.logger.warning(e)
            abort(500)

        user_json = {
            'id': user.id,
        }

        return jsonify( { 'user': user_json } ), 201

    def delete(self, user_id):
        # delete a single user
        pass

    def put(self, user_id):
        # update a single user
        pass

class FriendAPI(MethodView):
    def get(self, friend_id):
        if not session['user']:
            return 'not logged in'

        try:
            user = User.query.filter(User.id == session['user_id']).first()
            friend = User.query.filter(User.id == friend_id).first()
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
            friend = User.query.filter(User.id == data['user']['id']).first()
            user.friend(friend)
        except Exception, e:
            current_app.logger.warning(e)
            abort(500)

        return jsonify({'result': True}), 201

    def put(self):
        pass

    def delete(self, friend_id):
        if not session['user']:
            return 'not logged in'

        try:
            user = User.query.filter(User.id == session['user_id']).first()
            friend = User.query.filter(User.id == friend_id).first()
            user.unfriend(friend)
            db.session.commit()
        except Exception, e:
            current_app.logger.warning(e)
            abort(500)

        return jsonify({ 'result': True }), 204


def attach_views(app):
    #
    # Users API
    #
    user_api = UserAPI.as_view('user_api')
    app.add_url_rule('/api/users', view_func=user_api, methods=['POST',])
    app.add_url_rule('/api/users/<int:user_id>', view_func=user_api,
                                methods=['GET', 'PUT', 'DELETE'])
    app.add_url_rule('/api/users/me', view_func=user_api, methods=['GET'])

    #
    # Friends API
    #

    friend_api = FriendAPI.as_view('friend_api')
    app.add_url_rule('/api/friends', view_func=friend_api, methods=['POST'])
    app.add_url_rule('/api/friends/<int:friend_id>', view_func=friend_api, methods=['GET', 'DELETE'])
