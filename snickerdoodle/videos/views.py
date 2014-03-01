from flask import Flask, render_template, request, jsonify, abort, make_response, current_app
from flask.views import MethodView

from .models import Video
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
            'fb_id': video.fb_id
        }

        return jsonify( { 'video': video_json } ), 201

    def delete(self, video_id):
        # delete a single video
        pass

    def put(self, video_id):
        # update a single video
        pass

def attach_views(app):
    video_view = VideoAPI.as_view('video_api')
    app.add_url_rule('/videos/', defaults={'video_id': None},
                                view_func=video_view, methods=['GET',])
    app.add_url_rule('/videos/', view_func=video_view, methods=['POST',])
    app.add_url_rule('/videos/<int:video_id>', view_func=video_view,
                                methods=['GET', 'PUT', 'DELETE'])