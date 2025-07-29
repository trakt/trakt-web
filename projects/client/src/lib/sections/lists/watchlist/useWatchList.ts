import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { watchlistQuery } from '$lib/requests/queries/users/watchlistQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import type { SortType } from '@trakt/api';
import { derived } from 'svelte/store';

export type WatchListStoreProps = PaginationParams & FilterParams & {
  type?: MediaType;
  sort?: SortType;
  limit?: number;
};

export function useWatchList(params: WatchListStoreProps) {
  const { isLoading, list: items, page } = usePaginatedListQuery(
    watchlistQuery({
      limit: params.limit ?? DEFAULT_PAGE_SIZE,
      type: params.type,
      page: params.page,
      sort: params.sort ?? 'added',
      filter: params.filter,
    }),
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
