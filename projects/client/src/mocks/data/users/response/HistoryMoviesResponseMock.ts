import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import type { HistoryMoviesResponse } from '@trakt/api';

export const HistoryMoviesResponseMock: HistoryMoviesResponse[] = [
  {
    'id': 1,
    'watched_at': '2025-01-31T23:12:41.000Z',
    'action': 'watch',
    'type': 'movie',
    'movie': MovieHereticResponseMock,
  },
];
