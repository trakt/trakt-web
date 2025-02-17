import type { RatedItemResponse } from '@trakt/api';

export const RatedMoviesResponseMock: RatedItemResponse[] = [
  {
    'rated_at': '2025-01-16T17:39:23.000Z',
    'rating': 10,
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
