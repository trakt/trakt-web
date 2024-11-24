import type { MediaType } from '$lib/models/MediaType.ts';
import {
  type RecommendedMovie,
  recommendedMoviesQuery,
} from '$lib/requests/queries/recommendations/recommendedMoviesQuery.ts';
import {
  type RecommendedShow,
  recommendedShowsQuery,
} from '$lib/requests/queries/recommendations/recommendedShowsQuery.ts';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type RecommendedMedia = Array<RecommendedMovie | RecommendedShow>;

type RecommendationListStoreProps = {
  type: MediaType;
};

function typeToQuery(type: MediaType): CreateQueryOptions<RecommendedMedia> {
  switch (type) {
    case 'movie':
      return recommendedMoviesQuery();
    case 'show':
      return recommendedShowsQuery();
  }
}

export function useRecommendationList(
  { type }: RecommendationListStoreProps,
) {
  const query = createQuery(typeToQuery(type));
  const list = derived(query, ($query) => $query.data ?? []);

  return {
    list,
  };
}
