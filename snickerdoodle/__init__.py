from os import path

from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.script import Manager
from flask.ext.migrate import Migrate, MigrateCommand

BASE = path.join(path.dirname(path.abspath(__file__)), '..')
TEMPLATE_DIR = path.join(BASE, 'templates')
STATIC_DIR = path.join(BASE, 'static')

snickerdoodle = Flask(__name__,
                      template_folder=TEMPLATE_DIR,
                      static_folder=STATIC_DIR)

snickerdoodle.config.from_pyfile('settings.py')

db = SQLAlchemy(snickerdoodle)
migrate = Migrate(snickerdoodle, db)
manager = Manager(snickerdoodle)
manager.add_command('db', MigrateCommand)

from users.models import User
from rooms.models import Room
from videos.models import Video


@snickerdoodle.route("/")
def hello():
    return render_template('home.html')


@snickerdoodle.route("/connect")
def connect():
    return render_template('connect.html')


@snickerdoodle.route("/video")
def video():
    return render_template('video.html')
