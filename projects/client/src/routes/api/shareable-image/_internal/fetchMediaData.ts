import type { ApiParams } from '$lib/requests/api.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { moviePeopleQuery } from '$lib/requests/queries/movies/moviePeopleQuery.ts';
import { movieRatingQuery } from '$lib/requests/queries/movies/movieRatingQuery.ts';
import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { showPeopleQuery } from '$lib/requests/queries/shows/showPeopleQuery.ts';
import { showRatingQuery } from '$lib/requests/queries/shows/showRatingQuery.ts';
import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';

type FetchMediaDataParams = {
  type: MediaType;
  slug: string;
} & ApiParams;

export function fetchMediaData({ type, slug, fetch }: FetchMediaDataParams) {
  if (type === 'movie') {
    return Promise.all(
      [
        movieSummaryQuery({ slug, fetch }).execute(),
        movieRatingQuery({ slug, fetch }).execute(),
        moviePeopleQuery({ slug, fetch }).execute(),
      ] as const,
    );
  }

  return Promise.all(
    [
      showSummaryQuery({ slug, fetch }).execute(),
      showRatingQuery({ slug, fetch }).execute(),
      showPeopleQuery({ slug, fetch }).execute(),
    ] as const,
  );
}
