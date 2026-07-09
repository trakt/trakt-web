import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { createBulkMediaIntl } from '$lib/features/intl-overlay/createBulkMediaIntl.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import type { CreateQueryOptions } from '$lib/features/query/types.ts';
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
import { map } from 'rxjs';
import { recommendedMediaQuery } from '../../../requests/queries/media/mediaRecommendedQuery.ts';
import { useInMemoryPagination } from '../../../stores/useInMemoryPagination.ts';

export type RecommendedEntry = RecommendedMovie | RecommendedShow;
export type RecommendedMediaList = Array<RecommendedEntry>;

type RecommendationListStoreProps =
  & {
    type: DiscoverMode;
    isSmart?: boolean;
  }
  & PaginationParams
  & FilterParams;

function typeToQuery(
  { type, filter, filterOverride, isSmart }: Omit<
    RecommendationListStoreProps,
    'page'
  >,
) {
  /** Recommendations are calculated daily, so we load all of them. */
  const params = {
    limit: RECOMMENDED_UPPER_LIMIT,
    filter,
    filterOverride,
    isSmart,
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
  const suffix = props.isSmart ? '-smart' : '';

  if (props.filterOverride) {
    return `${props.type}-overridden${suffix}`;
  }

  const filters = props.filter ?? {};
  const hasFilters = Object.keys(filters).length > 0;

  const baseKey = hasFilters
    ? `${props.type}-${
      Object.entries(filters)
        .map(([key, value]) => `${key}-${value}`)
        .join('-')
    }`
    : props.type;

  return `${baseKey}${suffix}`;
}

export const useRecommendedList = (props: RecommendationListStoreProps) => {
  const query = typeToQuery(props);
  const queryObservable = useQuery(query);

  const listKey = getListKey(props);
  const overlay = createBulkMediaIntl<RecommendedEntry>();

  const allItems = queryObservable.pipe(
    map((q) => q.data ?? []),
    dailyOrderArray<RecommendedEntry>(
      `recommended-${listKey}-order`,
      (item) => item.key,
    ),
    overlay.operator,
  );

  const { list, hasNextPage, fetchNextPage } = useInMemoryPagination(allItems, {
    page: props.page,
    limit: props.limit,
  });

  const baseLoading = queryObservable.pipe(map(toLoadingState));

  return {
    list,
    isLoading: withOverlayLoading(baseLoading, overlay.intlLoading$),
    hasNextPage,
    fetchNextPage,
  };
};
