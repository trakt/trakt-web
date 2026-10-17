import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { createBulkMediaIntl } from '$lib/features/intl-overlay/createBulkMediaIntl.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
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
import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import { mediaAnticipatedQuery } from '$lib/requests/queries/media/mediaAnticipatedQuery.ts';
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

type DatedFilter = NonNullable<AnticipatedListStoreProps['filter']> & {
  end_date?: string;
};

function typeToQuery(
  { type, ...params }: AnticipatedListStoreProps,
) {
  if (!params.filter?.years && !params.theme) {
    // FIXME: remove this when behavior is uplifted to the server
    const current: DatedFilter = params.filter ?? {};
    const dated: DatedFilter = {
      ...current,
      end_date: current.end_date ?? addYear(new Date(), 1).toISOString(),
    };
    params.filter = dated;
  }

  switch (type) {
    case 'movie':
      return movieAnticipatedQuery(params) as InfiniteQuery<
        AnticipatedEntry
      >;
    case 'show':
      return showAnticipatedQuery(params) as InfiniteQuery<
        AnticipatedEntry
      >;
    case 'media':
      return mediaAnticipatedQuery(params) as InfiniteQuery<
        AnticipatedEntry
      >;
  }
}

export function useAnticipatedList(
  props: AnticipatedListStoreProps,
) {
  const { list: baseList, isLoading: baseLoading, ...rest } =
    usePaginatedListQuery(typeToQuery(props));
  const overlay = createBulkMediaIntl<AnticipatedEntry>();
  return {
    list: baseList.pipe(overlay.operator),
    isLoading: withOverlayLoading(baseLoading, overlay.intlLoading$),
    ...rest,
  };
}
