from flask import Flask, render_template, request, jsonify, abort, make_response, current_app
from flask.views import View
from flask.views import MethodView

from .models import Room
from ..extensions import db

class RoomAPI(MethodView):

    def get(self, room_id):
        if room_id is None:
            # return a list of rooms
            pass
        else:
            # expose a single room
            try:
                room = Room.query.filter(Room.id == room_id).first()
            except Exception, e:
                current_app.logger.warning(e)
                abort(500)

            room_json = {
                'id': room.id,
                'name': room.name,
                'host_id': room.host_id
            }

            return jsonify( {'room': room_json} )

    def post(self):
        # create a new room
        if not request.json or not 'room' in request.json:
            abort(400)
        try:
            data = request.get_json(force=True)
            room = Room(data['room']['name'], data['room']['host_id'])
            db.session.add(room)
            db.session.commit()
        except Exception, e:
            current_app.logger.warning(e)
            abort(500)

        room_json = {
            'id': room.id,
            'name': room.name,
            'host_id': room.host_id
        }

        return jsonify( { 'room': room_json } ), 201

    def delete(self, room_id):
        # delete a single user
        pass

    def put(self, room_id):
        # update a single room
        pass

def attach_views(app):
    room_view = RoomAPI.as_view('room_api')
    app.add_url_rule('/rooms/', defaults={'room_id': None},
                                view_func=room_view, methods=['GET',])
    app.add_url_rule('/rooms/', view_func=room_view, methods=['POST',])
    app.add_url_rule('/rooms/<int:room_id>', view_func=room_view,
                                methods=['GET', 'PUT', 'DELETE'])