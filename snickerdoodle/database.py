from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.migrate import Migrate
from snickerdoodle import app

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://postgres@localhost/snickerdoodle'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

