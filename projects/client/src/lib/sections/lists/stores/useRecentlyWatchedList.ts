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
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';

type RecentlyWatchedListStoreProps = PaginationParams & {
  type: 'movie' | 'episode' | 'all';
};

export type HistoryEntry = MovieActivityHistory | EpisodeActivityHistory;

function typeToQuery(
  { type, limit, page }: RecentlyWatchedListStoreProps,
) {
  const params = {
    limit,
    page,
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
