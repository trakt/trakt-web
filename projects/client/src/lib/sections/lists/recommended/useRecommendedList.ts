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
import { weave } from '$lib/utils/array/weave.ts';
import { RECOMMENDED_UPPER_LIMIT } from '$lib/utils/constants.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { combineLatest, map, type Observable, shareReplay } from 'rxjs';
import { paginate } from './paginate.ts';

export type RecommendedEntry = RecommendedMovie | RecommendedShow;
export type RecommendedMediaList = Array<RecommendedEntry>;

type RecommendationListStoreProps =
  & {
    type: DiscoverMode;
  }
  & PaginationParams
  & FilterParams;

function typeToQueries(
  { type, filter }: Omit<RecommendationListStoreProps, 'page'>,
) {
  /** Recommendations are calculated daily, so we load all of them. */
  const params = {
    limit: RECOMMENDED_UPPER_LIMIT,
    filter,
  };

  switch (type) {
    case 'movie':
      return [recommendedMoviesQuery(params) as CreateQueryOptions<
        RecommendedMediaList
      >];
    case 'show':
      return [recommendedShowsQuery(params) as CreateQueryOptions<
        RecommendedMediaList
      >];
    case 'media':
      return [
        recommendedShowsQuery(params) as CreateQueryOptions<
          RecommendedMediaList
        >,
        recommendedMoviesQuery(params) as CreateQueryOptions<
          RecommendedMediaList
        >,
      ];
  }
}

export const useRecommendedList = (props: RecommendationListStoreProps) => {
  const queries = typeToQueries(props)
    .map((query) => toObservable(useQuery(query)).pipe(shareReplay(1)));

  const filters = props.filter ?? {};
  const hasFilters = Object.keys(filters).length > 0;

  const listKey = hasFilters
    ? `${props.type}-${
      Object.entries(filters)
        .map(([key, value]) => `${key}-${value}`)
        .join('-')
    }`
    : props.type;

  const allItems = combineLatest(queries).pipe(
    map((queryResults) => {
      const isMixed = props.type === 'media';
      const lists = queryResults.map((q) => q.data ?? []);
      const items = isMixed ? weave(...lists) : lists.flat();

      return items;
    }),
    dailyOrderArray<RecommendedEntry>(
      `recommended-${listKey}-order`,
      (item) => item.id,
    ),
  );

  const list: Observable<RecommendedMediaList> = allItems.pipe(
    paginate({ page: props.page, limit: props.limit }),
  );

  const page = allItems.pipe(
    map((items) => ({
      current: props.page,
      total: Math.ceil(items.length / props.limit),
    })),
  );

  const isLoading = combineLatest(queries).pipe(
    map((queryResults) => queryResults.some(toLoadingState)),
  );

  return {
    list,
    page,
    isLoading,
  };
};
