import { useQuery } from '$lib/features/query/useQuery.ts';
import { type MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import { movieRelatedQuery } from '$lib/requests/queries/movies/movieRelatedQuery.ts';
import {
  type RelatedShow,
  showRelatedQuery,
} from '$lib/requests/queries/shows/showRelatedQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import type { MediaType } from '../../../requests/models/MediaType.ts';

export type RelatedEntry = RelatedShow | MovieEntry;
export type RelatedMediaList = Array<RelatedEntry>;

type PopularListStoreProps = {
  type: MediaType;
  slug: string;
};

function typeToQuery(
  { type, slug }: PopularListStoreProps,
) {
  const params = { slug };

  switch (type) {
    case 'movie':
      return movieRelatedQuery(params) as CreateQueryOptions<RelatedMediaList>;
    case 'show':
      return showRelatedQuery(params) as CreateQueryOptions<RelatedMediaList>;
  }
}

export function useRelatedList(
  { type, slug }: PopularListStoreProps,
) {
  const query = useQuery(typeToQuery({ type, slug }));
  const list = derived(query, ($query) => $query.data ?? []);

  return {
    list,
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
}
