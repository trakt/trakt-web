import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock';
import { MovieMatrixResponseMock } from '$mocks/data/summary/movies/matrix/MovieMatrixResponseMock';
import type { MovieTrendingResponse } from '@trakt/api';

export const MoviesTrendingResponseMock: MovieTrendingResponse[] = [
  {
    watchers: 127434,
    movie: MovieHereticResponseMock,
  },
  {
    watchers: 12,
    movie: MovieMatrixResponseMock,
  },
];
