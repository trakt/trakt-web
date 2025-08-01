import type { WatchlistedItem } from '$lib/requests/queries/users/watchlistQuery.ts';

export const WatchlistMoviesMappedMock: WatchlistedItem[] = [
  {
    'id': 1146014560,
    'listedAt': new Date('2024-12-27T21:34:14.000Z'),
    'notes': null,
    'rank': 1,
    'type': 'movie',
    'entry': {
      'colors': undefined,
      'airDate': new Date('9999-12-31T23:59:59.999Z'),
      'certification': undefined,
      'country': undefined,
      'cover': {
        'url': {
          'medium': '/placeholders/purple_placeholder.png' as HttpsUrl,
          'thumb': '/placeholders/landscape_placeholder.png' as HttpsUrl,
        },
      },
      'logo': {
        'url': {
          'medium': '/placeholders/purple_placeholder.png' as HttpsUrl,
          'thumb': '/placeholders/landscape_placeholder.png' as HttpsUrl,
        },
      },
      'genres': [],
      'id': 481,
      'languages': undefined,
      'overview': 'TBD',
      'poster': {
        'url': {
          'medium': '/placeholders/portrait_placeholder.png' as HttpsUrl,
          'thumb': '/placeholders/portrait_placeholder.png' as HttpsUrl,
        },
      },
      'runtime': NaN,
      'slug': 'the-matrix-1999',
      'status': 'unknown',
      'tagline': '',
      'thumb': {
        'url': '/placeholders/landscape_placeholder.png' as HttpsUrl,
      },
      'title': 'The Matrix',
      'originalTitle': undefined,
      'trailer': 'https://www.youtube.com/watch?v=o-YBDTqX_ZU',
      'type': 'movie',
      'year': 1999,
      'votes': 0,
      'plexSlug': undefined,
      'creditCookies': [],
    },
  },
];
