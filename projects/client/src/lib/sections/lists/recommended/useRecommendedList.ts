import { useQuery } from '$lib/features/query/useQuery.ts';
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
import { toInMemoryPaginatable } from '$lib/sections/lists/recommended/toInMemoryPaginatable.ts';
import { useDailyOrderedArray } from '$lib/sections/lists/stores/useDailyOrderedArray.ts';
import { RECOMMENDED_UPPER_LIMIT } from '$lib/utils/constants.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { onMount } from 'svelte';
import { derived } from 'svelte/store';

export type RecommendedEntry = RecommendedMovie | RecommendedShow;
export type RecommendedMediaList = Array<RecommendedEntry>;

type RecommendationListStoreProps = {
  type: MediaType;
} & PaginationParams;

function typeToQuery(
  { type }: Omit<RecommendationListStoreProps, 'page'>,
) {
  /** Recommendations are calculated daily, so we load all of them. */
  const props = { type, limit: RECOMMENDED_UPPER_LIMIT };

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

function useLimitRecommendedList(
  props: Omit<RecommendationListStoreProps, 'page'>,
) {
  const query = useQuery(typeToQuery(props));
  const unstable = derived(query, ($query) => $query.data ?? []);
  const isLoading = derived(
    query,
    toLoadingState,
  );

  const { list, set } = useDailyOrderedArray<RecommendedEntry>({
    key: `recommended-${props.type}-order`,
    getId: (item) => item.id,
  });

  onMount(() => {
    const unsubscribe = unstable.subscribe(set);

    return () => unsubscribe();
  });

  return {
    list: derived(
      list,
      ($list) => $list.slice(0, props.limit),
    ),
    isLoading,
  };
}

export const useRecommendedList = (props: RecommendationListStoreProps) =>
  toInMemoryPaginatable({
    useList: useLimitRecommendedList,
    total: props.limit,
    type: props.type,
  })({ ...props });
