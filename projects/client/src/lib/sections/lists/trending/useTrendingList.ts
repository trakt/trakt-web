import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import {
  movieTrendingQuery,
  type TrendingMovie,
} from '$lib/requests/queries/movies/movieTrendingQuery.ts';
import {
  showTrendingQuery,
  type TrendingShow,
} from '$lib/requests/queries/shows/showTrendingQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type TrendingEntry = TrendingMovie | TrendingShow;

type TrendingListStoreProps = {
  type: MediaType;
  limit?: number;
  page?: number;
};

function typeToQuery(
  { type, limit, page }: TrendingListStoreProps,
) {
  const params = {
    limit,
    page,
  };

  switch (type) {
    case 'movie':
      return movieTrendingQuery(params) as CreateQueryOptions<
        Paginatable<TrendingEntry>
      >;
    case 'show':
      return showTrendingQuery(params) as CreateQueryOptions<
        Paginatable<TrendingEntry>
      >;
  }
}

export function useTrendingList(
  { type, limit, page }: TrendingListStoreProps,
) {
  const query = useQuery(typeToQuery({ type, limit, page }));
  const isLoading = derived(
    query,
    toLoadingState,
  );

  return {
    isLoading,
    list: derived(query, ($query) => $query.data?.entries ?? []),
    page: derived(
      query,
      ($query) => $query.data?.page ?? { page: 0, total: 0 },
    ),
  };
}
