import type { MediaType } from '$lib/models/MediaType.ts';
import {
  movieTrendingQuery,
  type TrendingMovie,
} from '$lib/requests/queries/movies/movieTrendingQuery.ts';
import {
  showTrendingQuery,
  type TrendingShow,
} from '$lib/requests/queries/shows/showTrendingQuery.ts';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type TrendingMediaItem = TrendingMovie | TrendingShow;
export type TrendingMedia = Array<TrendingMediaItem>;

type TrendingListStoreProps = {
  type: MediaType;
  limit?: number;
};

function typeToQuery(
  { type, limit }: TrendingListStoreProps,
): CreateQueryOptions<TrendingMedia> {
  const params = {
    limit,
  };

  switch (type) {
    case 'movie':
      return movieTrendingQuery(params);
    case 'show':
      return showTrendingQuery(params);
    case 'episode':
      throw new Error('Not implemented');
  }
}

export function useTrendingList(
  { type, limit = 25 }: TrendingListStoreProps,
) {
  const query = createQuery(typeToQuery({ type, limit }));
  const list = derived(query, ($query) => $query.data ?? []);

  return {
    list,
  };
}
