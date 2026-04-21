import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { WatchListIntent } from '$lib/requests/models/WatchListIntent.ts';
import { watchlistQuery } from '$lib/requests/queries/users/watchlistQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { combineLatest, map } from 'rxjs';
import { useUpNextList } from '../progress/useUpNextList.ts';
import type { SortBy } from '../user/models/SortBy.ts';
import type { SortDirection } from '../user/models/SortDirection.ts';

export type WatchListStoreProps = PaginationParams & FilterParams & {
  type?: DiscoverMode;
  sortBy?: SortBy;
  sortHow?: SortDirection;
  limit?: number;
  intent?: WatchListIntent;
};

export function useWatchList(params: WatchListStoreProps) {
  const defaultSort = params.intent === 'default' ? 'added' : 'released';

  const { list: items, ...rest } = usePaginatedListQuery(
    watchlistQuery({
      limit: params.limit ?? DEFAULT_PAGE_SIZE,
      type: params.type === 'media' ? undefined : params.type,
      sortBy: params.sortBy ?? defaultSort,
      sortHow: params.sortHow ?? 'desc',
      filter: params.filter,
      hide: params.intent === 'start' ? 'unreleased' : undefined,
    }),
  );

  const result = {
    list: items.pipe(
      map(($items) =>
        $items
          .filter((item) => item.type === 'movie' || item.type === 'show')
      ),
    ),
    ...rest,
  };

  if (params.intent === 'default') {
    return result;
  }

  /*
    In case of `start`, we use useUpNextList to get items already in progress
    and filter them out so only unwatched movies remain.
  */
  const continueQuery = useUpNextList({
    type: params.type ?? 'media',
    filter: params.filter,
    limit: params.limit,
  });

  const filteredList = combineLatest([result.list, continueQuery.list]).pipe(
    map(([$startList, $continueList]) => {
      const continueIds = new Set(
        $continueList.map((entry) =>
          'show' in entry ? entry.show.key : entry.key
        ),
      );
      return $startList.filter((item) => !continueIds.has(item.entry.key));
    }),
  );

  return {
    ...result,
    list: filteredList,
    isLoading: combineLatest([result.isLoading, continueQuery.isLoading]).pipe(
      map(([$startLoading, $continueLoading]) =>
        $startLoading || $continueLoading
      ),
    ),
  };
}
