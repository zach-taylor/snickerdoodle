from flask import Flask, render_template, request, session, redirect, url_for
from snickerdoodle import snickerdoodle
from snickerdoodle.extensions import facebook

@snickerdoodle.route('/login')
def login():
    return facebook.authorize(callback=url_for('facebook_authorized', _external=True))


@snickerdoodle.route('/login/authorized')
@facebook.authorized_handler
def facebook_authorized(resp):  #you can/should do registration here
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    session['oauth_token'] = (resp['access_token'], '')

    return redirect(url_for('index'))  # redirect to home/index page


@facebook.tokengetter
def get_facebook_oauth_token():
    return session.get('oauth_token')