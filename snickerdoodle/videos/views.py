from flask import Flask, render_template, request, jsonify, abort, make_response, current_app
from flask.views import MethodView

from snickerdoodle.lib import youtube

from .models import Video
from ..rooms.models import Room
from ..extensions import db

class VideoAPI(MethodView):

    def get(self, video_id):
        if video_id is None:
            # return a list of videos
            pass
        else:
            # expose a single video
            try:
                video = Video.query.filter(Video.id == video_id).first()
            except Exception, e:
                current_app.logger.warning(e)
                abort(500)

            video_json = {
                'id': video.id,
                'vid': video.vid,
                'room_id': video.room_id
            }

            return jsonify( {'video': video_json} )

    def post(self):
        # create a new video
        if not request.json or not 'video' in request.json:
            abort(400)
        try:
            data = request.get_json(force=True)
            video = Video(data['video']['vid'], data['video']['room_id'])
            db.session.add(video)
            db.session.commit()
        except Exception, e:
            current_app.logger.warning(e)
            abort(500)

        video_json = {
            'id': video.id,
            'site': video.site,
            'vid': video.vid
        }

        return jsonify( { 'video': video_json } ), 201

    def delete(self, video_id):
        # delete a single video
        pass

    def put(self, video_id):
        # update a single video
        pass

class RoomVideosView(MethodView):
    def get(self, room_id):
        try:
            room = Room.query.filter(Room.id == room_id).first()
            #videos = Video.query.filter(Video.room_id == room.id).all()
        except Exception, e:
            current_app.logger.warning(e)
            abort(500)

        videos_array = []

        for v in room.videos:
            video_json = {
                'id': v.id,
                'site': v.site,
                'vid': v.vid
            }
            videos_array.append(video_json)

        return jsonify({'videos': videos_array})



class VideoSearch(MethodView):

    def get(self):
        q = request.args.get('q', '')

        if not q:
            results = {}
        else:
            results = youtube.search_for_video(q)

        return jsonify(results=results)


def attach_views(app):
    video_view = VideoAPI.as_view('video_api')
    room_videos_view = RoomVideosView.as_view('room_videos_api')

    app.add_url_rule('/api/videos/', defaults={'video_id': None},
                                view_func=video_view, methods=['GET',])
    app.add_url_rule('/api/videos/', view_func=video_view, methods=['POST',])
    app.add_url_rule('/api/videos/<int:video_id>', view_func=video_view,
                                methods=['GET', 'PUT', 'DELETE'])
    app.add_url_rule('/api/rooms/<int:room_id>/videos/', view_func=room_videos_view, methods=['GET'])

    video_search = VideoSearch.as_view('video_search')
    app.add_url_rule('/videos/search', view_func=video_search)
