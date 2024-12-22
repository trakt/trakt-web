import type { MediaType } from '$lib/models/MediaType.ts';
import { type MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { moviePopularQuery } from '$lib/requests/queries/movies/moviePopularQuery.ts';
import {
  type PopularShow,
  showPopularQuery,
} from '$lib/requests/queries/shows/showPopularQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type PopularMediaItem = PopularShow | MovieSummary;
export type PopularMedia = Array<PopularMediaItem>;

type PopularListStoreProps = {
  type: MediaType;
  limit?: number;
};

function typeToQuery(
  { type, limit }: PopularListStoreProps,
): CreateQueryOptions<PopularMedia> {
  const params = {
    limit,
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
  { type, limit = 25 }: PopularListStoreProps,
) {
  const query = createQuery({
    ...typeToQuery({ type, limit }),
    staleTime: time.hours(1),
  });
  const list = derived(query, ($query) => $query.data ?? []);

  return {
    list,
  };
}
