import { ShowSiloMinimalResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloMinimalResponseMock.ts';
import type { RatedItemResponse } from '@trakt/api';

export const RatedSeasonsResponseMock: RatedItemResponse[] = [
  {
    'rated_at': '2025-01-16T17:41:12.000Z',
    'rating': 8,
    'type': 'season',
    'season': {
      'number': 1,
      'ids': {
        'trakt': 257490,
        'tvdb': 1928276,
        'tmdb': 196076,
      },
      'aired_episodes': 10,
    },
    'show': ShowSiloMinimalResponseMock,
  },
];
