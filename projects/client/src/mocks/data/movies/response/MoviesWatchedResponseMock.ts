import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { MovieMatrixResponseMock } from '$mocks/data/summary/movies/matrix/MovieMatrixResponseMock.ts';
import type { MovieWatchedResponse } from '@trakt/api';

export const MoviesWatchedResponseMock: MovieWatchedResponse[] = [
  {
    watcher_count: 127434,
    play_count: 1,
    collected_count: 1,
    movie: MovieHereticResponseMock,
  },
  {
    watcher_count: 12,
    play_count: 12,
    collected_count: 12,
    movie: MovieMatrixResponseMock,
  },
];
