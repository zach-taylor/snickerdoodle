from ..extensions import db

class Video(db.Model):
    __tablename__ = 'videos'
    id = db.Column(db.Integer, primary_key = True)
    site = db.Column(db.String(255))
    vid = db.Column(db.String(255))
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'))

    def __init__(self, site=None, vid=None, room_id=None):
        self.site = site
        self.vid = vid
        self.room_id = room_id

    def __repr__(self):
        return '<Video %r>' % (self.id)