import type { FavoritedShowsResponse } from '@trakt/api';

export const FavoritedShowsResponseMock: FavoritedShowsResponse[] = [
  {
    'rank': 4,
    'id': 1157183370,
    'listed_at': '2025-01-16T17:37:41.000Z',
    'notes': null,
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
      'aired_episodes': 19,
    },
  },
];
