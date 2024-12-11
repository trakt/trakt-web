import type { MediaType } from '$lib/models/MediaType.ts';
import { type MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { type ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { moviePopularQuery } from '$lib/requests/queries/movies/moviePopularQuery.ts';
import { showPopularQuery } from '$lib/requests/queries/shows/showPopularQuery.ts';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type PopularMediaItem = ShowSummary | MovieSummary;
export type PopularMedia = Array<PopularMediaItem>;

const POPULAR_LIMIT = 25;

type PopularListStoreProps = {
  type: MediaType;
};

function typeToQuery(type: MediaType): CreateQueryOptions<PopularMedia> {
  const params = {
    limit: POPULAR_LIMIT,
  };

  switch (type) {
    case 'movie':
      return moviePopularQuery(params);
    case 'show':
      return showPopularQuery(params);
    case 'episode':
      throw new Error('Not implemented');
  }
}

export function usePopularList(
  { type }: PopularListStoreProps,
) {
  const query = createQuery(typeToQuery(type));
  const list = derived(query, ($query) => $query.data ?? []);

  return {
    list,
  };
}
