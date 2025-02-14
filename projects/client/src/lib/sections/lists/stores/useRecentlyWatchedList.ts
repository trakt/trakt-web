import { useQuery } from '$lib/features/query/useQuery.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import {
  episodeHistoryQuery,
  type HistoryEpisode,
} from '$lib/requests/queries/users/episodeHistoryQuery.ts';
import {
  type HistoryMovie,
  movieHistoryQuery,
} from '$lib/requests/queries/users/movieHistoryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

const HISTORY_LIMIT = 25;

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
