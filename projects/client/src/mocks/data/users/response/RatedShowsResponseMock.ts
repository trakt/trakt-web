import type { RatedItemResponse } from '@trakt/api';

export const RatedShowsResponseMock: RatedItemResponse[] = [
  {
    'rated_at': '2025-01-16T17:39:23.000Z',
    'rating': 9,
    'type': 'show',
    'show': {
      'title': 'Silo',
      'year': 2023,
      'ids': {
        'trakt': 180770,
        'slug': 'silo',
        'tvdb': 403245,
        'imdb': 'tt14688458',
        'tmdb': 125988,
      },
    },
  },
];
