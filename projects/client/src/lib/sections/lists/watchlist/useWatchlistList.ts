import type { SortType } from '$lib/api.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import {
  movieWatchlistQuery,
  type WatchlistMovie,
} from '$lib/requests/queries/users/movieWatchlistQuery.ts';
import {
  showWatchlistQuery,
  type WatchlistShow,
} from '$lib/requests/queries/users/showWatchlistQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

// FIXME remove when sorting is fixed
const WATCHLIST_LIMIT = 500;

export type WatchListParams = {
  sort: SortType;
};

export type WatchlistMediaItem = WatchlistMovie | WatchlistShow;
export type WatchlistMediaList = Array<WatchlistMediaItem>;

export type WatchListStoreProps = {
  type: MediaType;
  limit?: number;
  page?: number;
} & Partial<WatchListParams>;

function typeToQuery(
  { type, page, sort = 'added' }: WatchListStoreProps,
) {
  const params = {
    limit: WATCHLIST_LIMIT,
    page,
    sort,
  };

  switch (type) {
    case 'movie':
      return movieWatchlistQuery(params) as CreateQueryOptions<
        Paginatable<WatchlistMediaItem>
      >;
    case 'show':
      return showWatchlistQuery(params) as CreateQueryOptions<
        Paginatable<WatchlistMediaItem>
      >;
  }
}

export function useWatchlistList(params: WatchListStoreProps) {
  const query = useQuery(typeToQuery(params));
  const list = derived(
    query,
    ($query) => ($query.data?.entries ?? []).map((item) => item.entry),
  );

  const isLoading = derived(
    query,
    toLoadingState,
  );

  return {
    list,
    isLoading,
    page: derived(
      query,
      ($query) => $query.data?.page ?? { page: 0, total: 0 },
    ),
  };
}
