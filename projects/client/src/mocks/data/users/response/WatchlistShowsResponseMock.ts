import { ShowSiloMinimalResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloMinimalResponseMock.ts';
import type { ListedShowResponse } from '@trakt/api';

export const WatchlistShowsResponseMock: ListedShowResponse[] = [
  {
    'rank': 1,
    'id': 1146015487,
    'listed_at': '2024-12-27T21:36:48.000Z',
    'notes': null,
    'type': 'show',
    'show': ShowSiloMinimalResponseMock,
  },
];
