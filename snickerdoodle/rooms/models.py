from ..extensions import db

class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    host_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    videos = db.relationship('Video', backref = 'room', lazy = 'dynamic')

    def __init__(self, name=None, host_id=None):
        self.name = name
        self.host_id = host_id

    def __repr__(self):
        return '<Room %r>' % (self.id)