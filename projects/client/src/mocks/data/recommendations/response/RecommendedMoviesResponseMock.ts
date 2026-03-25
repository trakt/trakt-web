import type { RecommendationsMovieResponse } from '$lib/requests/models/RecommendationsResponse.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';

export const RecommendedMoviesResponseMock: RecommendationsMovieResponse = [
  {
    movie: MovieHereticResponseMock,
    score: 8.5,
    sources: [],
  },
];
