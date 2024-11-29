import type { MovieRating } from '$lib/requests/queries/movies/movieRatingQuery.ts';

export type MediaSummaryProps<T> = {
  media: T;
  ratings: MovieRating;
};
