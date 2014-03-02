from ..extensions import db

class Friend(db.Model):
    __tablename__ = 'friends'
    id = db.Column(db.Integer, primary_key=True)
    friender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    friendee_id = db.Column(db.Integer, db.ForeignKey('users.id'))