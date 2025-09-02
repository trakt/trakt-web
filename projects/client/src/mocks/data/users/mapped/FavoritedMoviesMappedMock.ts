import type { FavoritedEntry } from '$lib/requests/models/FavoritedEntry.ts';

export const FavoritedMoviesMappedMock: FavoritedEntry[] = [
  {
    'favoritedAt': new Date('2025-01-16T17:37:18.000Z'),
    'id': 916302,
    'rank': 1,
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
      'id': 916302,
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
      'slug': 'heretic-2024',
      'status': 'unknown',
      'tagline': '',
      'thumb': {
        'url': '/placeholders/landscape_placeholder.png' as HttpsUrl,
      },
      'title': 'Heretic',
      'trailer': 'https://www.youtube.com/watch?v=o-YBDTqX_ZU',
      'type': 'movie',
      'year': 2024,
      'votes': 0,
      'colors': undefined,
      'plexSlug': undefined,
      'creditCookies': [],
    },
  },
];
