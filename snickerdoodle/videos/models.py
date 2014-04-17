from ..extensions import db


STATUS_QUEUED = 0
STATUS_PLAYING = 1
STATUS_PLAYED = 2

class Video(db.Model):
    __tablename__ = 'videos'
    id = db.Column(db.Integer, primary_key = True)
    site = db.Column(db.String(255))
    vid = db.Column(db.String(255))
    title = db.Column(db.String(255))
    icon = db.Column(db.String(255))
    status = db.Column(db.SmallInteger, default = STATUS_QUEUED)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'))

    def __init__(self, site=None, vid=None, title=None, icon=None, status=None, room_id=None):
        self.site = site
        self.vid = vid
        self.title = title
        self.icon = icon
        self.status = status
        self.room_id = room_id

    def __repr__(self):
        return '<Video %r>' % (self.id)