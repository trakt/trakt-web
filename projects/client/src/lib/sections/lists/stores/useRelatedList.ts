import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { type MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { movieRelatedQuery } from '$lib/requests/queries/movies/movieRelatedQuery.ts';
import {
  type RelatedShow,
  showRelatedQuery,
} from '$lib/requests/queries/shows/showRelatedQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';

export type RelatedEntry = RelatedShow | MovieEntry;
export type RelatedMediaList = Paginatable<RelatedEntry>;

type RelatedListStoreProps = PaginationParams & {
  type: MediaType;
  slug: string;
};

function typeToQuery(
  params: RelatedListStoreProps,
) {
  switch (params.type) {
    case 'movie':
      return movieRelatedQuery(params) as CreateQueryOptions<RelatedMediaList>;
    case 'show':
      return showRelatedQuery(params) as CreateQueryOptions<RelatedMediaList>;
  }
}

export function useRelatedList(
  props: RelatedListStoreProps,
) {
  return usePaginatedListQuery(typeToQuery(props));
}
