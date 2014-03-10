from snickerdoodle import db


friends = db.Table('friends',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('friend_id', db.Integer, db.ForeignKey('users.id'))
)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    display_name = db.Column(db.String(120))
    fb_id = db.Column(db.String(255), unique=True)
    fb_username = db.Column(db.String(255))
    oauth_token = db.Column(db.Text())
    friended = db.relationship('User',
        secondary = friends,
        primaryjoin = (friends.c.user_id == id),
        secondaryjoin = (friends.c.friend_id == id),
        backref = db.backref('friends', lazy = 'dynamic'),
        lazy = 'dynamic')

    def __init__(self, fb_id=None):
        self.fb_id = fb_id

    def __repr__(self):
        return '<User %r>' % (self.fb_id)

    @staticmethod
    def add_user(user):
        db.session.add(user)

    @staticmethod
    def commit():
        db.session.commit()
