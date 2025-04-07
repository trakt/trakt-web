import type { StreamingMovie } from '$lib/requests/queries/movies/movieStreamingQuery.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';

export const MoviesStreamingMappedMock: StreamingMovie[] = [
  {
    rank: 1,
    delta: 5,
    ...MovieHereticMappedMock,
  },
  {
    rank: 13,
    delta: -4,
    ...MovieMatrixMappedMock,
  },
];
