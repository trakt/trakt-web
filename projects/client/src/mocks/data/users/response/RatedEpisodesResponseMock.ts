import { ShowSiloMinimalResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloMinimalResponseMock.ts';
import type { RatedItemResponse } from '@trakt/api';

export const RatedEpisodesResponseMock: RatedItemResponse[] = [
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
    'show': ShowSiloMinimalResponseMock,
  },
];
