import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { watchlistQuery } from '$lib/requests/queries/users/watchlistQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { map } from 'rxjs';
import type { SortBy } from '../user/models/SortBy.ts';
import type { SortDirection } from '../user/models/SortDirection.ts';

export type WatchListStoreProps = PaginationParams & FilterParams & {
  type?: DiscoverMode;
  sortBy?: SortBy;
  sortHow?: SortDirection;
  limit?: number;
};

export function useWatchList(params: WatchListStoreProps) {
  const { list: items, ...rest } = usePaginatedListQuery(
    watchlistQuery({
      limit: params.limit ?? DEFAULT_PAGE_SIZE,
      type: params.type === 'media' ? undefined : params.type,
      sortBy: params.sortBy ?? 'added',
      sortHow: params.sortHow,
      filter: params.filter,
    }),
  );

  return {
    list: items.pipe(
      map(($items) =>
        $items
          .filter((item) => item.type === 'movie' || item.type === 'show')
      ),
    ),
    ...rest,
  };
}
