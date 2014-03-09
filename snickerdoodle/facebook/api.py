import urllib
import urlparse
import requests

GRAPH_ROOT = 'https://graph.facebook.com/'
OAUTH_ROOT = 'https://graph.facebook.com/oauth/access_token'
DIALOG_ROOT = 'https://www.facebook.com/dialog/oauth'

SETTINGS = {
    'oauth_redirect': 'http://localhost:5000/',
    'app_id': 'none',
    'app_secret': 'none',
}


def configure(app_id, app_secret, oauth_redirect):
    """
    Basic helper function to make configuring the Facebook API easier.

    """
    SETTINGS['app_id'] = app_id
    SETTINGS['app_secret'] = app_secret
    SETTINGS['oauth_redirect'] = oauth_redirect


def access_token(code):
    """
    Use the code given to us by the Facebook OAuth callback and ask for the
    real OAuth Access token that will actually let us get data.

    """

    params = {
        'client_id': SETTINGS['app_id'],
        'client_secret': SETTINGS['app_secret'],
        'redirect_uri': SETTINGS['oauth_redirect'],
        'code': code,
    }

    response = requests.get(OAUTH_ROOT, params=params)

    # TODO: Better error checking & return object
    if response.status_code == 200:
        data = urlparse.parse_qs(response.text)
        return data.get('access_token', None)

    return None


def login_url():
    """
    Helper function to generate the OAuth login URL.

    """
    params = {
        'client_id': SETTINGS['app_id'],
        'redirect_uri': SETTINGS['oauth_redirect'],
    }

    return '{0}?{1}'.format(DIALOG_ROOT, urllib.urlencode(params))


class GraphApi(object):

    def __init__(self, access_token):
        self.token = access_token

    def get_graph_info(self, node, fields):
        return self.request(node, fields=fields)

    def put_graph_info(self):
        pass

    def request(self, node, fields=None, data=None, method='get'):
        fields['access_token'] = self.token

        url = '{root}/{node}'.format(root=GRAPH_ROOT, node=node.strip('/'))

        response = requests.request(method, url, params=fields, data=data)

        return response.json()
