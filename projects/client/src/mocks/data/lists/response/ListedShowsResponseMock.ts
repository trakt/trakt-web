import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import type { ListedShowResponse } from '@trakt/api';

export const ListedShowsResponseMock: ListedShowResponse[] = [
  {
    'rank': 1,
    'id': 1234,
    'listed_at': '2024-12-27T21:34:14.000Z',
    'notes': null,
    'type': 'show',
    'show': ShowSiloResponseMock,
  },
];
