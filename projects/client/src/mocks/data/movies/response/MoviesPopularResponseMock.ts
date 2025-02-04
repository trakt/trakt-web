import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { MovieMatrixResponseMock } from '$mocks/data/summary/movies/matrix/MovieMatrixResponseMock.ts';
import type { MovieResponse } from '@trakt/api';

export const MoviesPopularResponseMock: MovieResponse[] = [
  MovieHereticResponseMock,
  MovieMatrixResponseMock,
];
