import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { type MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { moviePopularQuery } from '$lib/requests/queries/movies/moviePopularQuery.ts';
import {
  type PopularShow,
  showPopularQuery,
} from '$lib/requests/queries/shows/showPopularQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';

export type PopularEntry = PopularShow | MovieEntry;
export type PopularMediaList = Array<PopularEntry>;

type PopularListStoreProps =
  & {
    type: MediaType;
  }
  & PaginationParams
  & FilterParams;

function typeToQuery(
  { type, limit, page, filter }: PopularListStoreProps,
) {
  const params = {
    limit,
    page,
    filter,
  };

  switch (type) {
    case 'movie':
      return moviePopularQuery(params);
    case 'show':
      return showPopularQuery(params);
  }
}

export function usePopularList(
  props: PopularListStoreProps,
) {
  return usePaginatedListQuery(typeToQuery(props));
}
