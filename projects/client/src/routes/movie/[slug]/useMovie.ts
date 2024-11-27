import { movieRatingQuery } from '$lib/requests/queries/movies/movieRatingQuery.ts';
import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export function useMovie(slug: string) {
  const movie = createQuery(
    movieSummaryQuery({
      slug,
    }),
  );

  const ratings = createQuery(
    movieRatingQuery({
      slug,
    }),
  );

  return {
    movie: derived(movie, ($movie) => $movie.data),
    ratings: derived(ratings, ($rating) => $rating.data),
  };
}
