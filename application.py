from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.script import Manager
from flask.ext.migrate import Migrate, MigrateCommand


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://postgres@localhost/snickerdoodle'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)

DEBUG_MODE = True




@app.route("/")
def hello():
    return render_template('home.html')


@app.route('/connect')
def connect():
    return render_template('connect.html')


if __name__ == "__main__":
    app.debug = DEBUG_MODE
    manager.run(host='snickerdoodle.com')
