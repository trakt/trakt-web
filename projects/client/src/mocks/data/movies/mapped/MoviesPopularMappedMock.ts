import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';

export const MoviesPopularMappedMock: MovieEntry[] = [
  MovieHereticMappedMock,
  MovieMatrixMappedMock,
];
