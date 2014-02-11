from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.script import Manager
from flask.ext.migrate import Migrate, MigrateCommand

snickerdoodle = Flask(__name__)

snickerdoodle.config.from_pyfile('settings.py')

db = SQLAlchemy(snickerdoodle)
migrate = Migrate(snickerdoodle, db)
manager = Manager(snickerdoodle)
manager.add_command('db', MigrateCommand)

from users.models import User
from rooms.models import Room

@snickerdoodle.route("/")
def hello():
    return render_template('home.html')

@snickerdoodle.route("/connect")
def connect():
    return render_template('connect.html')


