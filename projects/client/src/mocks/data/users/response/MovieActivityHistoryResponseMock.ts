import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import type { MovieActivityHistoryResponse } from '@trakt/api';

export const MovieActivityHistoryResponseMock: MovieActivityHistoryResponse[] =
  [
    {
      'id': 1,
      'watched_at': '2025-01-31T23:12:41.000Z',
      'action': 'watch',
      'type': 'movie',
      'movie': MovieHereticResponseMock,
    },
  ];
