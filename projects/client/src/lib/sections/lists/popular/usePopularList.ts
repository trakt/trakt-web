import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { createBulkMediaIntl } from '$lib/features/intl-overlay/createBulkMediaIntl.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { type MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { moviePopularQuery } from '$lib/requests/queries/movies/moviePopularQuery.ts';
import {
  showPopularQuery,
} from '$lib/requests/queries/shows/showPopularQuery.ts';
import { addYear } from '$lib/utils/date/addYear.ts';
import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import { mediaPopularQuery } from '$lib/requests/queries/media/mediaPopularQuery.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';
import { withListOverlay } from '$lib/sections/lists/stores/withListOverlay.ts';

export type PopularEntry = ShowEntry | MovieEntry;
export type PopularMediaList = Array<PopularEntry>;

type PopularListStoreProps =
  & {
    type: DiscoverMode;
  }
  & PaginationParams
  & FilterParams
  & SearchParams;

type DatedFilter = NonNullable<PopularListStoreProps['filter']> & {
  start_date?: string;
  end_date?: string;
};

function typeToQuery(
  { type, ...params }: PopularListStoreProps,
) {
  if (!params.filter?.years && !params.theme) {
    // FIXME: remove this when behavior is uplifted to the server
    const current: DatedFilter = params.filter ?? {};
    const dated: DatedFilter = {
      ...current,
      start_date: current.start_date ?? addYear(new Date(), -1).toISOString(),
      end_date: current.end_date ?? addYear(new Date(), 0).toISOString(),
    };
    params.filter = dated;
  }

  switch (type) {
    case 'movie':
      return moviePopularQuery(params) as InfiniteQuery<
        PopularEntry
      >;
    case 'show':
      return showPopularQuery(params) as InfiniteQuery<PopularEntry>;
    case 'media':
      return mediaPopularQuery(params) as InfiniteQuery<
        PopularEntry
      >;
  }
}

export function usePopularList(
  props: PopularListStoreProps,
) {
  return withListOverlay(
    usePaginatedListQuery(typeToQuery(props)),
    createBulkMediaIntl<PopularEntry>(),
  );
}
