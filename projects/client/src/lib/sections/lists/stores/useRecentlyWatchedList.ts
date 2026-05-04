import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { activityHistoryQuery } from '$lib/requests/queries/users/activityHistoryQuery.ts';
import {
  episodeActivityHistoryQuery,
} from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import {
  movieActivityHistoryQuery,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import {
  showActivityHistoryQuery,
} from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { map } from 'rxjs';
import { mapToCalendarPeriods } from './_internal/mapToCalendarPeriods.ts';
import type { HistoryEntry } from './models/HistoryEntry.ts';

export type RecentlyWatchedType = 'movie' | 'show' | 'episode' | 'media';

type RecentlyWatchedListStoreProps = {
  type: RecentlyWatchedType;
  limit?: number;
  slug?: string;
  id?: number;
  page?: number;
} & FilterParams;

function typeToQuery(
  { type, id, slug, page, limit, filter }: RecentlyWatchedListStoreProps,
) {
  const params = {
    limit: limit ?? DEFAULT_PAGE_SIZE,
    slug: slug ?? 'me',
    id,
    page: page ?? 1,
    filter,
  };

  switch (type) {
    case 'movie':
      return movieActivityHistoryQuery(params) as InfiniteQuery<
        HistoryEntry
      >;
    case 'episode':
      return episodeActivityHistoryQuery(params) as InfiniteQuery<
        HistoryEntry
      >;
    case 'show':
      return showActivityHistoryQuery(params) as InfiniteQuery<
        HistoryEntry
      >;
    default:
      // FIXME: switch to all endpoint
      return activityHistoryQuery(params) as InfiniteQuery<
        HistoryEntry
      >;
  }
}

export function useRecentlyWatchedList(
  params: RecentlyWatchedListStoreProps,
) {
  const { list, ...rest } = usePaginatedListQuery(typeToQuery(params));

  const periods = list.pipe(
    map((items) => mapToCalendarPeriods(items)),
  );

  return { list, periods, ...rest };
}
