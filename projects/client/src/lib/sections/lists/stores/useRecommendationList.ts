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
};

function typeToQuery(type: MediaType): CreateQueryOptions<RecommendedMedia> {
  switch (type) {
    case 'movie':
      return recommendedMoviesQuery();
    case 'show':
      return recommendedShowsQuery();
    case 'episode':
      throw new Error('Not implemented');
  }
}

export function useRecommendationList(
  { type }: RecommendationListStoreProps,
) {
  const query = createQuery({
    ...typeToQuery(type),
    staleTime: time.hours(24),
  });
  const list = derived(query, ($query) => $query.data ?? []);

  return {
    list,
  };
}
