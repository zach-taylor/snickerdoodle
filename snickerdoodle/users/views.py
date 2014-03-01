from flask import Flask, render_template, request, jsonify, abort, make_response, current_app
from flask.views import MethodView

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

            user_json = {
                'id': user.id,
                'fb_id': user.fb_id
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

def attach_views(app):
    user_view = UserAPI.as_view('user_api')
    print 'users attach_view'
    app.add_url_rule('/users/', defaults={'user_id': None},
                                view_func=user_view, methods=['GET',])
    app.add_url_rule('/users/', view_func=user_view, methods=['POST',])
    app.add_url_rule('/users/<int:user_id>', view_func=user_view,
                                methods=['GET', 'PUT', 'DELETE'])