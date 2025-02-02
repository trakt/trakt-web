import type { FavoritedEntry } from '$lib/requests/models/FavoritedEntry';

export const FavoritedShowsMappedMock: FavoritedEntry[] = [
  {
    'favoritedAt': new Date('2025-01-16T17:37:41.000Z'),
    'id': 180770,
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
    },
  },
];
