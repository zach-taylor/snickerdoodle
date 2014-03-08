from flask import session

from snickerdoodle.facebook import login_url


def default_context():
    """
    Default context for all templates.

    """

    context = {
        'user': session.get('user', {}),
        'login_url': login_url(),
    }

    return context
