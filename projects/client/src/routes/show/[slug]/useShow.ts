import { showRatingQuery } from '$lib/requests/queries/movies/showRatingQuery.ts';
import { showSummaryQuery } from '$lib/requests/queries/movies/showSummaryQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export function useShow(slug: string) {
  const show = createQuery(
    showSummaryQuery({
      slug,
    }),
  );

  const ratings = createQuery(
    showRatingQuery({
      slug,
    }),
  );

  return {
    show: derived(show, ($movie) => $movie.data),
    ratings: derived(ratings, ($ratings) => $ratings.data),
  };
}
