import type { WatchlistShow } from '$lib/requests/queries/users/showWatchlistQuery.ts';

export const WatchlistShowsMappedMock: WatchlistShow[] = [
  {
    'id': 1146015487,
    'listedAt': new Date('2024-12-27T21:36:48.000Z'),
    'notes': null,
    'rank': 1,
    'type': 'show',
    'entry': {
      'episode': {
        'count': 17,
      },
      'airDate': new Date('9999-12-31T23:59:59.999Z'),
      'certification': undefined,
      'country': undefined,
      'cover': {
        'url': {
          'medium': '/placeholders/purple_placeholder.png' as HttpsUrl,
          'thumb': '/placeholders/landscape_placeholder.png' as HttpsUrl,
        },
      },
      'genres': [],
      'id': 180770,
      'languages': undefined,
      'overview': 'TBD',
      'poster': {
        'url': {
          'medium': '/placeholders/portrait_placeholder.png' as HttpsUrl,
          'thumb': '/placeholders/portrait_placeholder.png' as HttpsUrl,
        },
      },
      'runtime': NaN,
      'slug': 'silo',
      'status': 'unknown',
      'tagline': '',
      'thumb': {
        'url': '/placeholders/landscape_placeholder.png' as HttpsUrl,
      },
      'title': 'Silo',
      'trailer': 'https://www.youtube.com/watch?v=o-YBDTqX_ZU',
      'type': 'show',
      'year': 2023,
      'votes': 0,
    },
  },
];
