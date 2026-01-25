import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { type MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { movieRelatedQuery } from '$lib/requests/queries/movies/movieRelatedQuery.ts';
import {
  type RelatedShow,
  showRelatedQuery,
} from '$lib/requests/queries/shows/showRelatedQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { DEFAULT_RELATED_LIMIT } from '$lib/utils/constants.ts';

export type RelatedEntry = RelatedShow | MovieEntry;

type RelatedListStoreProps = PaginationParams & {
  type: MediaType;
  slug: string;
};

function typeToQuery(
  props: RelatedListStoreProps,
) {
  const params = {
    ...props,
    limit: DEFAULT_RELATED_LIMIT,
  };

  switch (params.type) {
    case 'movie':
      return movieRelatedQuery(params) as InfiniteQuery<
        RelatedEntry
      >;
    case 'show':
      return showRelatedQuery(params) as InfiniteQuery<RelatedEntry>;
  }
}

export function useRelatedList(
  props: RelatedListStoreProps,
) {
  return usePaginatedListQuery(typeToQuery(props));
}
