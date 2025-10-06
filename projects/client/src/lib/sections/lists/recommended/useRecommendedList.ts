import { useQuery } from '$lib/features/query/useQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
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
import { map, type Observable, shareReplay } from 'rxjs';
import { toObservable } from '../../../utils/store/toObservable.ts';
import { paginate } from './paginate.ts';

export type RecommendedEntry = RecommendedMovie | RecommendedShow;
export type RecommendedMediaList = Array<RecommendedEntry>;

type RecommendationListStoreProps =
  & {
    type: MediaType;
  }
  & PaginationParams
  & FilterParams;

function typeToQuery(
  { type, filter }: Omit<RecommendationListStoreProps, 'page'>,
) {
  /** Recommendations are calculated daily, so we load all of them. */
  const props = {
    type,
    limit: RECOMMENDED_UPPER_LIMIT,
    filter,
  };

  switch (type) {
    case 'movie':
      return recommendedMoviesQuery(props) as CreateQueryOptions<
        RecommendedMediaList
      >;
    case 'show':
      return recommendedShowsQuery(props) as CreateQueryOptions<
        RecommendedMediaList
      >;
  }
}

export const useRecommendedList = (props: RecommendationListStoreProps) => {
  const query = toObservable(useQuery(typeToQuery(props))).pipe(
    shareReplay(1),
  );

  const filters = props.filter ?? {};
  const hasFilters = Object.keys(filters).length > 0;

  const listKey = hasFilters
    ? `${props.type}-${
      Object.entries(filters)
        .map(([key, value]) => `${key}-${value}`)
        .join('-')
    }`
    : props.type;

  const allItems = query.pipe(
    map((q) => q.data ?? []),
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

  const isLoading = query.pipe(map(toLoadingState));

  return {
    list,
    page,
    isLoading,
  };
};
