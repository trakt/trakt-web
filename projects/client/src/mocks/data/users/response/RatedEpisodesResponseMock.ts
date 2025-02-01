import type { RatedEpisodesResponse } from '@trakt/api';

export const RatedEpisodesResponseMock: RatedEpisodesResponse[] = [
  {
    'rated_at': '2025-01-16T17:40:52.000Z',
    'rating': 10,
    'type': 'episode',
    'episode': {
      'season': 1,
      'number': 1,
      'title': 'Freedom Day',
      'ids': {
        'trakt': 5165667,
        'tvdb': 8440385,
        'imdb': 'tt14693272',
        'tmdb': 2964686,
      },
    },
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
