import { useQuery } from '$lib/features/query/useQuery';
import type { Paginatable } from '$lib/requests/models/Paginatable';
import {
  episodeHistoryQuery,
  type HistoryEpisode,
} from '$lib/requests/queries/users/episodeHistoryQuery';
import {
  type HistoryMovie,
  movieHistoryQuery,
} from '$lib/requests/queries/users/movieHistoryQuery.ts';
import { getPastMonthRange } from '$lib/utils/date/getPastMonthRange.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

const HISTORY_LIMIT = 1000;

type RecentlyWatchedListStoreProps = {
  type: 'movie' | 'episode';
  limit?: number;
  page?: number;
};

export type HistoryEntry = HistoryMovie | HistoryEpisode;

function typeToQuery(
  { type, limit, page }: RecentlyWatchedListStoreProps,
) {
  const params = {
    ...getPastMonthRange(new Date()),
    limit: limit ?? HISTORY_LIMIT,
    page,
  };

  switch (type) {
    case 'movie':
      return movieHistoryQuery(params) as CreateQueryOptions<
        Paginatable<HistoryEntry>
      >;
    case 'episode':
      return episodeHistoryQuery(params) as CreateQueryOptions<
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
