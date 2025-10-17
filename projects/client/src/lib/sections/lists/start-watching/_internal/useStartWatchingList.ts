import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { derived } from 'svelte/store';
import type { PaginationParams } from '../../../../requests/models/PaginationParams.ts';
import { useWatchList } from '../../watchlist/useWatchList.ts';

const RELEASED_LIST_LIMIT = 500;

export type UseStartWatchingProps = PaginationParams & {
  type: MediaType;
};

export function useStartWatchingList(
  props: UseStartWatchingProps,
) {
  const { list: watchlist, isLoading, page } = useWatchList({
    ...props,
    sort: 'released',
    limit: RELEASED_LIST_LIMIT,
  });

  const list = derived(
    watchlist,
    ($watchlist) =>
      $watchlist
        .filter((item) => item?.airDate.getTime() <= Date.now()),
  );

  return {
    list,
    isLoading,
    page,
  };
}
