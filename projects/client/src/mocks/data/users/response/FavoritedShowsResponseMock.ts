import type { FavoriteShowResponse } from '@trakt/api';
import { ShowSiloResponseMock } from '../../summary/shows/silo/response/ShowSiloResponseMock.ts';

export const FavoritedShowsResponseMock: FavoriteShowResponse[] = [
  {
    'rank': 4,
    'id': 1157183370,
    'listed_at': '2025-01-16T17:37:41.000Z',
    'notes': null,
    'type': 'show',
    'show': ShowSiloResponseMock,
  },
];
