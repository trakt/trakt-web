import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { watchlistQuery } from '$lib/requests/queries/users/watchlistQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import type { SortType } from '@trakt/api';
import { map } from 'rxjs';

export type WatchListStoreProps = PaginationParams & FilterParams & {
  type?: DiscoverMode;
  sort?: SortType;
  limit?: number;
};

export function useWatchList(params: WatchListStoreProps) {
  const { list: items, ...rest } = usePaginatedListQuery(
    watchlistQuery({
      limit: params.limit ?? DEFAULT_PAGE_SIZE,
      type: params.type === 'media' ? undefined : params.type,
      sort: params.sort ?? 'added',
      filter: params.filter,
    }),
  );

  return {
    list: items.pipe(
      map(($items) => $items.map((item) => item.entry)),
    ),
    ...rest,
  };
}
