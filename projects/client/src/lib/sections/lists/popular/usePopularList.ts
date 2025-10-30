import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { type MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { moviePopularQuery } from '$lib/requests/queries/movies/moviePopularQuery.ts';
import {
  showPopularQuery,
} from '$lib/requests/queries/shows/showPopularQuery.ts';
import { addYear } from '$lib/utils/date/addYear.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { mediaPopularQuery } from '../../../requests/queries/media/mediaPopularQuery.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';

export type PopularEntry = ShowEntry | MovieEntry;
export type PopularMediaList = Array<PopularEntry>;

type PopularListStoreProps =
  & {
    type: DiscoverMode;
  }
  & PaginationParams
  & FilterParams
  & SearchParams;

function typeToQuery(
  { type, ...params }: PopularListStoreProps,
) {
  if (!params.filter?.years) {
    // FIXME: remove this when behavior is uplifted to the server
    params.filter = params.filter ?? {};
    // @ts-expect-error we are extending the object to dedupe
    params.filter.start_date = params.filter?.start_date ??
      addYear(new Date(), -1).toISOString();
    // @ts-expect-error we are extending the object to dedupe
    params.filter.end_date = params.filter?.end_date ??
      addYear(new Date(), 0).toISOString();
  }

  switch (type) {
    case 'movie':
      return moviePopularQuery(params) as CreateQueryOptions<
        Paginatable<PopularEntry>
      >;
    case 'show':
      return showPopularQuery(params) as CreateQueryOptions<
        Paginatable<PopularEntry>
      >;
    case 'media':
      return mediaPopularQuery(params) as CreateQueryOptions<
        Paginatable<PopularEntry>
      >;
  }
}

export function usePopularList(
  props: PopularListStoreProps,
) {
  return usePaginatedListQuery(typeToQuery(props));
}
