import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import {
  type RecommendedMovie,
  recommendedMoviesQuery,
} from '$lib/requests/queries/recommendations/recommendedMoviesQuery.ts';
import {
  type RecommendedShow,
  recommendedShowsQuery,
} from '$lib/requests/queries/recommendations/recommendedShowsQuery.ts';
import { dailyOrderArray } from '$lib/sections/lists/stores/dailyOrderArray.ts';
import { RECOMMENDED_UPPER_LIMIT } from '$lib/utils/constants.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { map, shareReplay } from 'rxjs';
import { recommendedMediaQuery } from '../../../requests/queries/media/mediaRecommendedQuery.ts';
import { useInMemoryPagination } from '../../../stores/useInMemoryPagination.ts';

export type RecommendedEntry = RecommendedMovie | RecommendedShow;
export type RecommendedMediaList = Array<RecommendedEntry>;

type RecommendationListStoreProps =
  & {
    type: DiscoverMode;
  }
  & PaginationParams
  & FilterParams;

function typeToQuery(
  { type, filter, filterOverride }: Omit<RecommendationListStoreProps, 'page'>,
) {
  /** Recommendations are calculated daily, so we load all of them. */
  const params = {
    limit: RECOMMENDED_UPPER_LIMIT,
    filter,
    filterOverride,
  };

  switch (type) {
    case 'movie':
      return recommendedMoviesQuery(params) as CreateQueryOptions<
        RecommendedMediaList
      >;
    case 'show':
      return recommendedShowsQuery(params) as CreateQueryOptions<
        RecommendedMediaList
      >;
    case 'media':
      return recommendedMediaQuery(params) as CreateQueryOptions<
        RecommendedMediaList
      >;
  }
}

function getListKey(props: RecommendationListStoreProps) {
  if (props.filterOverride) {
    return `${props.type}-overridden`;
  }

  const filters = props.filter ?? {};
  const hasFilters = Object.keys(filters).length > 0;

  return hasFilters
    ? `${props.type}-${
      Object.entries(filters)
        .map(([key, value]) => `${key}-${value}`)
        .join('-')
    }`
    : props.type;
}

export const useRecommendedList = (props: RecommendationListStoreProps) => {
  const query = typeToQuery(props);
  const queryObservable = useQuery(query).pipe(shareReplay(1));

  const listKey = getListKey(props);

  const allItems = queryObservable.pipe(
    map((q) => q.data ?? []),
    dailyOrderArray<RecommendedEntry>(
      `recommended-${listKey}-order`,
      (item) => item.id,
    ),
  );

  const { list, hasNextPage, fetchNextPage } = useInMemoryPagination(allItems, {
    page: props.page,
    limit: props.limit,
  });

  const isLoading = queryObservable.pipe(
    map(toLoadingState),
  );

  return {
    list,
    isLoading,
    hasNextPage,
    fetchNextPage,
  };
};
