import type { TrendingMovie } from '$lib/requests/queries/movies/movieTrendingQuery';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock';

export const MoviesTrendingMappedMock: TrendingMovie[] = [
  {
    watchers: 127434,
    ...MovieHereticMappedMock,
  },
  {
    watchers: 12,
    ...MovieMatrixMappedMock,
  },
];
