import type { SortType } from '$lib/api.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import {
  movieWatchlistQuery,
  type WatchlistMovie,
} from '$lib/requests/queries/users/movieWatchlistQuery.ts';
import {
  showWatchlistQuery,
  type WatchlistShow,
} from '$lib/requests/queries/users/showWatchlistQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type WatchlistMediaItem = WatchlistMovie | WatchlistShow;
export type WatchlistMediaList = WatchlistMediaItem;

// FIXME remove when sorting is fixed
const WATCHLIST_LIMIT = 500;

export type WatchListStoreProps = PaginationParams & {
  type: MediaType;
  sort?: SortType;
};

function typeToQuery(params: WatchListStoreProps) {
  const queryParams = {
    limit: WATCHLIST_LIMIT,
    page: params.page,
    sort: params.sort ?? 'added',
  };

  switch (params.type) {
    case 'movie':
      return movieWatchlistQuery(queryParams) as CreateQueryOptions<
        Paginatable<WatchlistMediaList>
      >;
    case 'show':
      return showWatchlistQuery(queryParams) as CreateQueryOptions<
        Paginatable<WatchlistMediaList>
      >;
  }
}

export function useWatchList(params: WatchListStoreProps) {
  const { isLoading, list: items, page } = usePaginatedListQuery(
    typeToQuery(params),
  );

  return {
    isLoading,
    list: derived(
      items,
      ($items) => $items.map((item) => item.entry),
    ),
    page,
  };
}
