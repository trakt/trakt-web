import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import {
  movieTrendingQuery,
  type TrendingMovie,
} from '$lib/requests/queries/movies/movieTrendingQuery.ts';
import {
  showTrendingQuery,
  type TrendingShow,
} from '$lib/requests/queries/shows/showTrendingQuery.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import { mediaTrendingQuery } from '../../../requests/queries/media/mediaTrendingQuery.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';

export type TrendingEntry = TrendingMovie | TrendingShow;
export type TrendingMediaList = Paginatable<TrendingEntry>;

type TrendingListStoreProps = PaginationParams & FilterParams & SearchParams & {
  type: DiscoverMode;
};

function typeToQuery(
  params: TrendingListStoreProps,
) {
  switch (params.type) {
    case 'movie':
      return movieTrendingQuery(params) as CreateQueryOptions<
        TrendingMediaList
      >;
    case 'show':
      return showTrendingQuery(params) as CreateQueryOptions<TrendingMediaList>;
    case 'media':
      return mediaTrendingQuery(params) as CreateQueryOptions<
        TrendingMediaList
      >;
  }
}

export function useTrendingList(
  props: TrendingListStoreProps,
) {
  const { list, page, isLoading } = usePaginatedListQuery(
    typeToQuery(props),
  );

  return {
    list: derived(
      list,
      ($list) => {
        // TODO: remove this filter when the server is fixed
        return $list.filter((entry) => entry.id !== 0 && entry.slug !== null);
      },
    ),
    page,
    isLoading,
  };
}
