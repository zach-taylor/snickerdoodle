from snickerdoodle import db


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True)
    display_name = db.Column(db.String(120))
    fb_id = db.Column(db.String(255), unique = True)

    def __init__(self, fb_id=None):
        self.fb_id = fb_id

    def __repr__(self):
        return '<User %r>' % (self.fb_id)