import urllib
import urlparse
import requests

OAUTH_ROOT = 'https://graph.facebook.com/oauth/access_token'
DIALOG_ROOT = 'https://www.facebook.com/dialog/oauth'

SETTINGS = {
    'oauth_redirect': 'http://localhost:5000/',
    'app_id': 'none',
    'app_secret': 'none',
}


def configure(app_id, app_secret, oauth_redirect):
    SETTINGS['app_id'] = app_id
    SETTINGS['app_secret'] = app_secret
    SETTINGS['oauth_redirect'] = oauth_redirect


def access_token(code):
    params = {
        'client_id': SETTINGS['app_id'],
        'client_secret': SETTINGS['app_secret'],
        'redirect_uri': SETTINGS['oauth_redirect'],
        'code': code,
    }

    response = requests.get(OAUTH_ROOT, params=params)
    print response
    print response.content
    print response.text

    # TODO: Better error checking & return object
    if response.status_code == 200:
        data = urlparse.parse_qs(response.text)
        return data.get('access_token', None)

    return None


def login_url():
    params = {
        'client_id': SETTINGS['app_id'],
        'redirect_uri': SETTINGS['oauth_redirect'],
    }

    return '{0}?{1}'.format(DIALOG_ROOT, urllib.urlencode(params))


class GraphApi(object):
    pass


