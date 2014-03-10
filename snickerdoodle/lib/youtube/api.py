from apiclient.discovery import build
from apiclient.errors import HttpError

SETTINGS = {
    'developer_key': 'none',
    'api_version': 'v3',
    'api_service': 'youtube',
}


def configure(developer_key):
    """
    Basic helper function to configure YouTube developer key.

    """
    SETTINGS['developer_key'] = developer_key


def search_for_video(q):

    youtube = build(SETTINGS['api_service'], SETTINGS['api_version'],
                    developerKey=SETTINGS['developer_key'])

    options = {}

    options['q'] = q

    # Basic video info
    options['part'] = 'id,snippet'

    # Default is 5, we want more
    options['maxResults'] = 25

    # Only videos
    options['type'] = 'video'

    try:
        # Build the query
        query = youtube.search().list(**options)

        # Execute
        response = query.execute()
    except HttpError, e:
        response = {}

    results = []

    for item in response.get('items', []):
        result = {}
        result['title'] = item['snippet']['title']
        result['icon'] = item['snippet']['thumbnails']['default']['url']

        results.append(result)

    return results
