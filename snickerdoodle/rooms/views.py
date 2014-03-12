from flask import Flask, render_template, request, jsonify, abort, make_response, redirect, current_app, url_for
from flask.views import MethodView

from .models import Room
from .forms import RoomForm
from ..extensions import db

class CreateRoomView(MethodView):
    def post(self):
        form = RoomForm()
        if form.validate_on_submit():
            room = Room(form.name.data, host_id=3)
            db.session.add(room)
            db.session.commit()
            return redirect(url_for('watch'))
        else:
            print 'fail'
            return redirect(url_for('home'))

class RoomAPI(MethodView):

    def get(self, room_id):
        if room_id is None:
            # TODO: return a list of rooms
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
        # TODO: delete a single room
        pass

    def put(self, room_id):
        if not request.json or not 'room' in request.json:
            abort(400)

        if 'name' in request.json and type(request.json['name']) != unicode:
            abort(400)

        try:
            room = Room.query.filter(Room.id == room_id).first()
        except Exception, e:
            current_app.logger.warning(e)
            abort(500)

        room.name = request.json['name']
        db.session.commit()

        return jsonify({}), 204

def attach_views(app):
    room_api = RoomAPI.as_view('room_api')
    room_view = CreateRoomView.as_view('room_view')
    app.add_url_rule('/api/rooms/', defaults={'room_id': None},
                                view_func=room_api, methods=['GET',])
    app.add_url_rule('/api/rooms/', view_func=room_api, methods=['POST',])
    app.add_url_rule('/api/rooms/<int:room_id>', view_func=room_api,
                                methods=['GET', 'PUT', 'DELETE'])
    app.add_url_rule('/rooms', view_func=room_view, methods=['POST'])