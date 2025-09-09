import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { type MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { moviePopularQuery } from '$lib/requests/queries/movies/moviePopularQuery.ts';
import {
  showPopularQuery,
} from '$lib/requests/queries/shows/showPopularQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';

export type PopularEntry = ShowEntry | MovieEntry;
export type PopularMediaList = Array<PopularEntry>;

type PopularListStoreProps =
  & {
    type: MediaType;
  }
  & PaginationParams
  & FilterParams
  & SearchParams;

function typeToQuery(
  { type, ...params }: PopularListStoreProps,
) {
  // FIXME: remove this when behavior is uplifted to the server
  params.filter = params.filter ?? {};
  params.filter.years = params.filter?.years ??
    new Date().getFullYear().toString();

  switch (type) {
    case 'movie':
      return moviePopularQuery(params) as CreateQueryOptions<
        Paginatable<PopularEntry>
      >;
    case 'show':
      return showPopularQuery(params) as CreateQueryOptions<
        Paginatable<PopularEntry>
      >;
  }
}

export function usePopularList(
  props: PopularListStoreProps,
) {
  return usePaginatedListQuery(typeToQuery(props));
}
