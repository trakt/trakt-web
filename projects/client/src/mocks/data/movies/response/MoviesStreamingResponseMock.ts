import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { MovieMatrixResponseMock } from '$mocks/data/summary/movies/matrix/MovieMatrixResponseMock.ts';
import type { MovieStreamingResponse } from '@trakt/api';

export const MoviesStreamingResponseMock: MovieStreamingResponse[] = [
  {
    rank: 1,
    delta: 5,
    movie: MovieHereticResponseMock,
  },
  {
    rank: 13,
    delta: -4,
    movie: MovieMatrixResponseMock,
  },
];
