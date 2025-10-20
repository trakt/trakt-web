import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import {
  type UpNextEntry,
  upNextNitroQuery,
} from '$lib/requests/queries/sync/upNextNitroQuery.ts';
import {
  type WatchlistedItem,
  watchlistQuery,
} from '$lib/requests/queries/users/watchlistQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

const RELEASED_LIST_LIMIT = 500;

export type UseStartWatchingProps = PaginationParams & {
  type: MediaType;
};

type StartWatchingEntry =
  | WatchlistedItem
  | UpNextEntry;

function typeToQuery(props: UseStartWatchingProps) {
  switch (props.type) {
    case 'movie':
      return watchlistQuery({
        ...props,
        limit: props.limit ?? RELEASED_LIST_LIMIT,
        sort: 'released',
      }) as CreateQueryOptions<
        Paginatable<StartWatchingEntry>
      >;
    case 'show':
      return upNextNitroQuery({
        ...props,
        intent: 'start',
      }) as CreateQueryOptions<
        Paginatable<StartWatchingEntry>
      >;
  }
}

export function useStartWatchingList(
  props: UseStartWatchingProps,
) {
  const { isLoading, list, page } = usePaginatedListQuery(
    typeToQuery(props),
  );

  return {
    list: derived(
      list,
      ($list) =>
        $list
          .map((item) => 'entry' in item ? item.entry : item.show)
          .filter((item) => item?.airDate.getTime() <= Date.now()),
    ),
    isLoading,
    page,
  };
}
