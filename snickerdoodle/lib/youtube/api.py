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


def popular_videos():

    youtube = build(SETTINGS['api_service'], SETTINGS['api_version'],
                    developerKey=SETTINGS['developer_key'])

    options = {}

    options['chart'] = 'mostPopular'
    options['regionCode'] = 'US'

    # Basic video info
    options['part'] = 'id,snippet'

    # Default is 5, we want more
    options['maxResults'] = 12

    try:
        # Build the query
        query = youtube.videos().list(**options)

        # Execute
        response = query.execute()
    except HttpError, e:
        response = {}

    results = []

    for item in response.get('items', []):
        result = {}

        # Video ID
        result['id'] = item['id']

        # Video Title
        result['title'] = item['snippet']['title']

        # Video Description
        result['description'] = item['snippet']['description']

        # High Thumbnail
        result['icon'] = item['snippet']['thumbnails']['high']['url']

        # Provider
        result['provider'] = 'YouTube'

        # Add the result
        results.append(result)

    return results


def search_for_video(q):

    youtube = build(SETTINGS['api_service'], SETTINGS['api_version'],
                    developerKey=SETTINGS['developer_key'])

    options = {}

    options['q'] = q

    # Basic video info
    options['part'] = 'id,snippet'

    # Default is 5, we want more
    options['maxResults'] = 10

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

        # Video ID
        result['id'] = item['id']['videoId']

        # Video Title
        result['title'] = item['snippet']['title']

        # Default Thumbnail
        result['icon'] = item['snippet']['thumbnails']['default']['url']

        # Provider
        result['provider'] = "YouTube";
        # Add the result
        results.append(result)

    return results
