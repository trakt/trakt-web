import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export function useMovie(slug: string) {
  const movie = createQuery(
    movieSummaryQuery({
      slug,
    }),
  );

  return derived(movie, ($movie) => $movie.data);
}
