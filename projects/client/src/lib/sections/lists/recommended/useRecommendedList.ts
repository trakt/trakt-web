import { useQuery } from '$lib/features/query/useQuery';
import type { MediaType } from '$lib/requests/models/MediaType';
import {
  type RecommendedMovie,
  recommendedMoviesQuery,
} from '$lib/requests/queries/recommendations/recommendedMoviesQuery.ts';
import {
  type RecommendedShow,
  recommendedShowsQuery,
} from '$lib/requests/queries/recommendations/recommendedShowsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type RecommendedEntry = RecommendedMovie | RecommendedShow;
export type RecommendedMediaList = Array<RecommendedEntry>;

type RecommendationListStoreProps = {
  type: MediaType;
  limit?: number;
};

function typeToQuery(
  { type, limit }: RecommendationListStoreProps,
) {
  const props = { limit };
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

export function useRecommendedList(
  props: RecommendationListStoreProps,
) {
  const query = useQuery(typeToQuery(props));
  const list = derived(query, ($query) => $query.data ?? []);
  const isLoading = derived(
    query,
    toLoadingState,
  );

  return {
    list,
    isLoading,
  };
}
