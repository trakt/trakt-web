import type { RecommendedMovie } from '$lib/requests/queries/recommendations/recommendedMoviesQuery.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';

export const RecommendedMoviesMappedMock: RecommendedMovie[] = [
  MovieHereticMappedMock,
];
