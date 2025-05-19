import type { FavoritedMoviesResponse } from '@trakt/api';

export const FavoritedMoviesResponseMock: FavoritedMoviesResponse[] = [
  {
    'rank': 1,
    'id': 1157183360,
    'listed_at': '2025-01-16T17:37:18.000Z',
    'notes': null,
    'type': 'movie',
    'movie': {
      'title': 'Heretic',
      'year': 2024,
      'ids': {
        'trakt': 916302,
        'slug': 'heretic-2024',
        'imdb': 'tt28015403',
        'tmdb': 1138194,
      },
    },
  },
];
