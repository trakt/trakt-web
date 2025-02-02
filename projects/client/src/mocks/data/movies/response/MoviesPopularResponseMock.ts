import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock';
import { MovieMatrixResponseMock } from '$mocks/data/summary/movies/matrix/MovieMatrixResponseMock';
import type { MovieResponse } from '@trakt/api';

export const MoviesPopularResponseMock: MovieResponse[] = [
  MovieHereticResponseMock,
  MovieMatrixResponseMock,
];
