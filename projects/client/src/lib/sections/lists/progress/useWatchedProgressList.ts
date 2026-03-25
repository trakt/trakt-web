import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { watchedProgressQuery } from '$lib/requests/queries/sync/watchedProgressQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';

type WatchedProgressListProps = PaginationParams;

export function useWatchedProgressList(
  props: WatchedProgressListProps,
) {
  return usePaginatedListQuery(watchedProgressQuery(props));
}
