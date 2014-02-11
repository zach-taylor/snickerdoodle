from snickerdoodle import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True)
    fb_oauth = db.Column(db.String(255))

    def __init__(self, fb_oauth=None):
        self.fb_oauth = fb_oauth

    def __repr__(self):
        return '<User %r>' % (self.fb_oauth)