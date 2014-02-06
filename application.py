from flask import Flask, render_template

app = Flask(__name__)

DEBUG_MODE = True


@app.route("/")
def hello():
    return render_template('home.html')


@app.route('/connect')
def connect():
    return render_template('connect.html')


if __name__ == "__main__":
    app.debug = DEBUG_MODE
    app.run(host='snickerdoodle.com')
