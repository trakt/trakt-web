import type { SortType } from '$lib/api.ts';
import type { MediaType } from '$lib/models/MediaType.ts';
import {
  movieWatchlistQuery,
  type WatchlistMovie,
} from '$lib/requests/queries/users/movieWatchlistQuery.ts';
import {
  showWatchlistQuery,
  type WatchlistShow,
} from '$lib/requests/queries/users/showWatchlistQuery.ts';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type WatchListParams = {
  sort: SortType;
};

export type WatchlistMediaItem = WatchlistMovie | WatchlistShow;
export type WatchlistMedia = Array<WatchlistMediaItem>;

export type WatchListStoreProps = {
  type: MediaType;
} & Partial<WatchListParams>;

function typeToQuery(
  { type, sort = 'rank' }: WatchListStoreProps,
): CreateQueryOptions<WatchlistMedia> {
  const params: WatchListParams = {
    sort,
  };

  switch (type) {
    case 'movie':
      return movieWatchlistQuery(params);
    case 'show':
      return showWatchlistQuery(params);
    case 'episode':
      throw new Error('Not implemented');
  }
}

export function useWatchlistList(params: WatchListStoreProps) {
  const query = createQuery(typeToQuery(params));
  const list = derived(
    query,
    ($query) => ($query.data ?? []).map((item) => item.mediaItem),
  );

  return {
    list,
  };
}
