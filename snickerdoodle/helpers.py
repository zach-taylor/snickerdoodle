import random

from flask import session

from snickerdoodle.utils import words
from snickerdoodle.lib.facebook import login_url


def default_context():
    """
    Default context for all templates.

    """

    context = {
        'user': session.get('user', {}),
        'login_url': login_url(),
    }

    return context


def generate_room_name(adjectives=2):
    noun = ''
    adjs = []

    noun = random.choice(words.nouns)

    for i in xrange(adjectives):
        adjs.append(random.choice(words.adjectives))

    join = ' and ' if adjectives >= 2 else ''
    name = '{adjs}{join}{last} {noun}'.format(adjs=', '.join(adjs[:-1]),
                                              join=join,
                                              last=adjs[-1],
                                              noun=noun)
    return name.title()

# Insert a user's id and name into the message
def insert_user_info(data):
    data['username'] = session['user']['name']
    data['user_id'] = session['user']['id']
    print data