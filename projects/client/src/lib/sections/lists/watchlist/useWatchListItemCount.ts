import { isNarrowedListView } from '$lib/sections/lists/stores/isNarrowedListView.ts';
import type { PaginatedItemCount } from '$lib/sections/lists/stores/PaginatedItemCount.ts';
import { usePaginatedItemCount } from '$lib/sections/lists/stores/usePaginatedItemCount.ts';
import type { Observable } from 'rxjs';
import { useWatchList, type WatchListStoreProps } from './useWatchList.ts';

/*
 * Emits the item count for a watchlist view. Params must mirror the
 * paginated watchlist so both share one query observer instead of firing a
 * second request.
 */
export function useWatchListItemCount(
  props: WatchListStoreProps,
): { itemCount: Observable<PaginatedItemCount | undefined> } {
  const query = useWatchList(props);

  return {
    itemCount: usePaginatedItemCount({
      query,
      isNarrowed: isNarrowedListView(props),
    }),
  };
}
