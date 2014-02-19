from snickerdoodle import db

class Video(db.Model):
    __tablename__ = 'videos'
    id = db.Column(db.Integer, primary_key = True)
    site = db.Column(db.String(255))
    site = db.Column(db.String(255))

    def __init__(self, site=None, vid=None):
        self.site = site
        self.vid = vid

    def __repr__(self):
        return '<Video %r>' % (self.site)