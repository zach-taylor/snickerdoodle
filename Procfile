web: gunicorn --worker-class socketio.sgunicorn.GeventSocketIOWorker snickerdoodle:snickerdoodle
init: python manage.py db upgrade
upgrade: python manage.py db upgrade
