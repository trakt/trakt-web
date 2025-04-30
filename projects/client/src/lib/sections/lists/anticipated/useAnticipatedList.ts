import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import {
  type AnticipatedMovie,
  movieAnticipatedQuery,
} from '$lib/requests/queries/movies/movieAnticipatedQuery.ts';
import { showAnticipatedQuery } from '$lib/requests/queries/shows/showAnticipatedQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';

export type AnticipatedEntry = AnticipatedMovie;
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
  switch (type) {
    case 'movie':
      return movieAnticipatedQuery(params);
    case 'show':
      return showAnticipatedQuery(params);
  }
}

export function useAnticipatedList(
  props: AnticipatedListStoreProps,
) {
  return usePaginatedListQuery(typeToQuery(props));
}
