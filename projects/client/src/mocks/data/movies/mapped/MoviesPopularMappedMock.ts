import type { MovieEntry } from '$lib/requests/models/MovieEntry';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock';

export const MoviesPopularMappedMock: MovieEntry[] = [
  MovieHereticMappedMock,
  MovieMatrixMappedMock,
];
