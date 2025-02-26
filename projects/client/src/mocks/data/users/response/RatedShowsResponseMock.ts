import { ShowSiloMinimalResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloMinimalResponseMock.ts';
import type { RatedItemResponse } from '@trakt/api';

export const RatedShowsResponseMock: RatedItemResponse[] = [
  {
    'rated_at': '2025-01-16T17:39:23.000Z',
    'rating': 9,
    'type': 'show',
    'show': ShowSiloMinimalResponseMock,
  },
];
