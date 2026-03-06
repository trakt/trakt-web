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
import { mapToActivityCalendar } from './_internal/mapToActivityCalendar.ts';
import type { HistoryEntry } from './models/HistoryEntry.ts';

export type RecentlyWatchedType = 'movie' | 'show' | 'episode' | 'all';

type DateRange = {
  startDate: Date;
  endDate: Date;
};

type RecentlyWatchedListStoreProps = {
  type: RecentlyWatchedType;
  limit?: number;
  slug?: string;
  id?: number;
  range?: DateRange;
} & FilterParams;

function typeToQuery(
  { type, id, slug, range, limit, filter }: RecentlyWatchedListStoreProps,
) {
  const params = {
    limit: limit ?? DEFAULT_PAGE_SIZE,
    slug: slug ?? 'me',
    id,
    startDate: range?.startDate,
    endDate: range?.endDate,
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
    case 'all':
      return activityHistoryQuery(params) as InfiniteQuery<
        HistoryEntry
      >;
  }
}

export function useRecentlyWatchedList(
  params: RecentlyWatchedListStoreProps,
) {
  const { list, ...rest } = usePaginatedListQuery(typeToQuery(params));

  const historyCalendar = list.pipe(
    map((items) => mapToActivityCalendar(items, params.range?.startDate)),
  );

  return { list, historyCalendar, ...rest };
}
