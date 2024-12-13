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
import type { ListSortType } from '../../../models/ListSortType.ts';

type WatchListParams = {
  sort: ListSortType;
};

export type WatchlistMediaItem = WatchlistMovie | WatchlistShow;
export type WatchlistMedia = Array<WatchlistMediaItem>;

type WatchListStoreProps = {
  type: MediaType;
};

function typeToQuery(type: MediaType): CreateQueryOptions<WatchlistMedia> {
  const params: WatchListParams = {
    sort: 'rank',
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

export function useWatchlistList(
  { type }: WatchListStoreProps,
) {
  const query = createQuery(typeToQuery(type));
  const list = derived(
    query,
    ($query) => ($query.data ?? []).map((item) => item.mediaItem),
  );

  return {
    list,
  };
}
