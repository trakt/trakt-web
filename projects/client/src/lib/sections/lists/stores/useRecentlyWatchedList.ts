import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { activityHistoryQuery } from '$lib/requests/queries/users/activityHistoryQuery.ts';
import {
  type EpisodeActivityHistory,
  episodeActivityHistoryQuery,
} from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import {
  type MovieActivityHistory,
  movieActivityHistoryQuery,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import {
  type ShowActivityHistory,
  showActivityHistoryQuery,
} from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';

export type RecentlyWatchedType = 'movie' | 'show' | 'episode' | 'all';

type RecentlyWatchedListStoreProps = PaginationParams & {
  type: RecentlyWatchedType;
  id?: number;
};

export type HistoryEntry =
  | MovieActivityHistory
  | ShowActivityHistory
  | EpisodeActivityHistory;

function typeToQuery(
  { type, limit, page, id }: RecentlyWatchedListStoreProps,
) {
  const params = {
    limit,
    page,
    id,
  };

  switch (type) {
    case 'movie':
      return movieActivityHistoryQuery(params) as CreateQueryOptions<
        Paginatable<HistoryEntry>
      >;
    case 'episode':
      return episodeActivityHistoryQuery(params) as CreateQueryOptions<
        Paginatable<HistoryEntry>
      >;
    case 'show':
      return showActivityHistoryQuery(params) as CreateQueryOptions<
        Paginatable<HistoryEntry>
      >;
    case 'all':
      return activityHistoryQuery(params) as CreateQueryOptions<
        Paginatable<HistoryEntry>
      >;
  }
}

export function useRecentlyWatchedList(
  params: RecentlyWatchedListStoreProps,
) {
  return usePaginatedListQuery(typeToQuery(params));
}
