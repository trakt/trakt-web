import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
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
import { addYear } from '$lib/utils/date/addYear.ts';
import type { PaginatableInfiniteQuery } from '../../../features/query/models/InfiniteQuery.ts';
import { mediaAnticipatedQuery } from '../../../requests/queries/media/mediaAnticipatedQuery.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';

export type AnticipatedEntry = AnticipatedMovie | AnticipatedShow;
export type AnticipatedMediaList = Array<AnticipatedEntry>;

type AnticipatedListStoreProps =
  & {
    type: DiscoverMode;
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
      return movieAnticipatedQuery(params) as PaginatableInfiniteQuery<
        AnticipatedEntry
      >;
    case 'show':
      return showAnticipatedQuery(params) as PaginatableInfiniteQuery<
        AnticipatedEntry
      >;
    case 'media':
      return mediaAnticipatedQuery(params) as PaginatableInfiniteQuery<
        AnticipatedEntry
      >;
  }
}

export function useAnticipatedList(
  props: AnticipatedListStoreProps,
) {
  return usePaginatedListQuery(typeToQuery(props));
}
