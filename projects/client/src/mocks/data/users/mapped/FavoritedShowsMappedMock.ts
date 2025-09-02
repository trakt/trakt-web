import type { FavoritedEntry } from '$lib/requests/models/FavoritedEntry.ts';

export const FavoritedShowsMappedMock: FavoritedEntry[] = [
  {
    'favoritedAt': new Date('2025-01-16T17:37:41.000Z'),
    'id': 180770,
    'rank': 4,
    'item': {
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
      'logo': {
        'url': {
          'medium': '/placeholders/purple_placeholder.png' as HttpsUrl,
          'thumb': '/placeholders/landscape_placeholder.png' as HttpsUrl,
        },
      },
      'originalTitle': undefined,
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
      'colors': undefined,
      'plexSlug': undefined,
      'episode': {
        'count': 19,
      },
      'creditCookies': [],
    },
  },
];
