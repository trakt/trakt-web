import type { MediaType } from '$lib/models/MediaType.ts';
import {
  type RecommendedMovie,
  recommendedMoviesQuery,
} from '$lib/requests/queries/recommendations/recommendedMoviesQuery.ts';
import {
  type RecommendedShow,
  recommendedShowsQuery,
} from '$lib/requests/queries/recommendations/recommendedShowsQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type RecommendedMediaItem = RecommendedMovie | RecommendedShow;
export type RecommendedMedia = Array<RecommendedMediaItem>;

type RecommendationListStoreProps = {
  type: MediaType;
  limit?: number;
};

function typeToQuery(
  { type, limit }: RecommendationListStoreProps,
): CreateQueryOptions<RecommendedMedia> {
  const props = { limit };
  switch (type) {
    case 'movie':
      return recommendedMoviesQuery(props);
    case 'show':
      return recommendedShowsQuery(props);
  }
}

export function useRecommendedList(
  props: RecommendationListStoreProps,
) {
  const query = createQuery({
    ...typeToQuery(props),
    staleTime: time.hours(24),
  });
  const list = derived(query, ($query) => $query.data ?? []);

  return {
    list,
  };
}
