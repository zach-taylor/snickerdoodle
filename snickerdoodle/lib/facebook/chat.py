import sys
import logging
import threading

import sleekxmpp

if sys.version_info < (3, 0):
    from sleekxmpp.util.misc_ops import setdefaultencoding
    setdefaultencoding('utf8')

FACEBOOK_SERVER = ('chat.facebook.com', 5222)


def invite_friends(access_token, api_key, sender, mesg, receivers):
    """
    Easy broadcasting function to send multiple Facebook Chat messages to all
    the receivers.

    It requires an access token, api key (of an application), and then of
    course a sender, a list of receivers, and a message body.

    """

    args = [access_token, api_key, sender, mesg]

    # There seriously has to be a better way of doing this...
    for receiver in receivers:
        thread = threading.Thread(target=send_message, args=args + [receiver])

        # Off to the races we go
        thread.start()


def send_message(access_token, api_key, sender, mesg, receiver):
    """
    Send a message using the FacebookChat XMPP chat client to the receiver
    from the sender.

    Facebook Access Tokens as well as an API key must be included.

    """

    logging.basicConfig(level=logging.DEBUG,
                        format='%(levelname)-8s %(message)s')

    xmpp = FacebookChat(sender, receiver, mesg)
    xmpp.credentials['api_key'] = api_key
    xmpp.credentials['access_token'] = access_token

    if xmpp.connect(FACEBOOK_SERVER):
        xmpp.process(block=True)


class FacebookChat(sleekxmpp.ClientXMPP):

    def __init__(self, sender, receiver, mesg):
        sleekxmpp.ClientXMPP.__init__(self,
                                      '-{0}@chat.facebook.com'.format(sender),
                                      None,
                                      sasl_mech='X-FACEBOOK-PLATFORM')

        self.mesg = mesg
        self.receiver = '-{0}@chat.facebook.com'.format(receiver)

        # Some plugins...
        self.register_plugin('xep_0030')
        self.register_plugin('xep_0004')
        self.register_plugin('xep_0060')
        self.register_plugin('xep_0199')

        self.add_event_handler("session_start", self.start)

    def start(self, event):
        self.send_presence()

        self.send_message(mto=self.receiver,
                          mbody=self.mesg,
                          mtype='chat')

        self.disconnect(wait=True)
