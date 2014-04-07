from snickerdoodle import db


friends = db.Table('friends',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('friend_id', db.Integer, db.ForeignKey('users.id')),
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

    def __init__(self, fb_id=None, display_name=None, fb_username=None, oauth_token=None):
        self.fb_id = fb_id
        self.display_name = display_name
        self.fb_username = fb_username
        self.oauth_token = oauth_token

    def __repr__(self):
        return '<User %r>' % (self.fb_id)

    def friend(self, user):
        if not self.is_friend(user):
            self.friended.append(user)
            return self

    def unfriend(self, user):
        if self.is_friend(user):
            self.friended.remove(user)
            user.friended.remove(self)
            return self

    def is_friend(self, user):
        left = self.friended.filter(friends.c.friend_id == user.id).count() > 0
        right = user.friended.filter(friends.c.friend_id == self.id).count() > 0
        return left and right

    def accept_friend(self, user):
        return self.friend(user)

    @staticmethod
    def add_user(user):
        db.session.add(user)

    @staticmethod
    def commit():
        db.session.commit()
