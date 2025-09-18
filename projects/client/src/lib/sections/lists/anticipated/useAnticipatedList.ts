import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import {
  type AnticipatedMovie,
  movieAnticipatedQuery,
} from '$lib/requests/queries/movies/movieAnticipatedQuery.ts';
import {
  type AnticipatedShow,
  showAnticipatedQuery,
} from '$lib/requests/queries/shows/showAnticipatedQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { addYear } from '../../../utils/date/addYear.ts';

export type AnticipatedEntry = AnticipatedMovie | AnticipatedShow;
export type AnticipatedMediaList = Array<AnticipatedEntry>;

type AnticipatedListStoreProps =
  & {
    type: MediaType;
  }
  & PaginationParams
  & FilterParams
  & SearchParams;

function typeToQuery(
  { type, ...params }: AnticipatedListStoreProps,
) {
  if (!params.filter?.years) {
    // FIXME: remove this when behavior is uplifted to the server
    params.filter = params.filter ?? {};
    // @ts-expect-error we are extending the object to dedupe
    params.filter.end_date = params.filter?.end_date ??
      addYear(new Date(), 1).toISOString();
  }

  switch (type) {
    case 'movie':
      return movieAnticipatedQuery(params) as CreateQueryOptions<
        Paginatable<AnticipatedEntry>
      >;
    case 'show':
      return showAnticipatedQuery(params) as CreateQueryOptions<
        Paginatable<AnticipatedEntry>
      >;
  }
}

export function useAnticipatedList(
  props: AnticipatedListStoreProps,
) {
  return usePaginatedListQuery(typeToQuery(props));
}
