from flask import Flask
from flask.ext.script import Manager
from flask.ext.migrate import MigrateCommand
from flask import render_template

app = Flask(__name__)

manager = Manager(app)
manager.add_command('db', MigrateCommand)

@app.route("/")
def hello():
    return render_template('home.html')

@app.route("/connect")
def connect():
    return render_template('connect.html')