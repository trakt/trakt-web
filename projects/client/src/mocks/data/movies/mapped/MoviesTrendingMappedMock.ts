import type { TrendingMovie } from '$lib/requests/queries/movies/movieTrendingQuery.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';

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
