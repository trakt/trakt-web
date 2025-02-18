import { useQuery } from '$lib/features/query/useQuery.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import { activityHistoryQuery } from '$lib/requests/queries/users/activityHistoryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import {
  type EpisodeActivityHistory,
  episodeActivityHistoryQuery,
} from '../../../requests/queries/users/episodeActivityHistoryQuery.ts';
import {
  type MovieActivityHistory,
  movieActivityHistoryQuery,
} from '../../../requests/queries/users/movieActivityHistoryQuery.ts';

const HISTORY_LIMIT = 25;

type RecentlyWatchedListStoreProps = {
  type: 'movie' | 'episode' | 'all';
  limit?: number;
  page?: number;
};

export type HistoryEntry = MovieActivityHistory | EpisodeActivityHistory;

function typeToQuery(
  { type, limit, page }: RecentlyWatchedListStoreProps,
) {
  const params = {
    limit: limit ?? HISTORY_LIMIT,
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
  const query = useQuery(typeToQuery(params));
  const isLoading = derived(
    query,
    toLoadingState,
  );

  return {
    isLoading,
    list: derived(
      query,
      ($query) => $query.data?.entries ?? [],
    ),
    page: derived(
      query,
      ($query) => $query.data?.page ?? { page: 0, total: 0 },
    ),
  };
}
