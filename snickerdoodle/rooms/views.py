from flask.views import View
from flask.views import MethodView

class RoomAPI(MethodView):

    def get(self, room_id):
        if room_id is None:
            # return a list of rooms
            pass
        else:
            # expose a single room
            pass

    def post(self):
        # create a new room
        pass

    def delete(self, room_id):
        # delete a single user
        pass

    def put(self, rooom_id):
        # update a single room
        pass

room_view = RoomAPI.as_view('room_api')
snickerdoodle.add_url_rule('/rooms/', defaults={'room_id': None},
                            view_func=room_view, methods=['GET',])
snickerdoodle.add_url_rule('/rooms/', view_func=room_view, methods=['POST',])
snickerdoodle.add_url_rule('/rooms/<int:room_id>', view_func=room_view,
                            methods=['GET', 'PUT', 'DELETE'])