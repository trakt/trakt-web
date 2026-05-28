import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
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

export type RecentlyWatchedType = ExtendedMediaType | 'media';

type SpecificHistory = {
  type: ExtendedMediaType;
  id?: number;
};

type MediaHistory = {
  type: 'media';
};

type RecentlyWatchedListStoreProps =
  & {
    limit?: number;
    slug?: string;
    page?: number;
    startDate?: Date;
    endDate?: Date;
  }
  & FilterParams
  & (SpecificHistory | MediaHistory);

function typeToQuery(
  props: RecentlyWatchedListStoreProps,
) {
  const params = {
    limit: props.limit ?? DEFAULT_PAGE_SIZE,
    slug: props.slug ?? 'me',
    page: props.page ?? 1,
    filter: props.filter,
    startDate: props.startDate,
    endDate: props.endDate,
  };

  switch (props.type) {
    case 'movie':
      return movieActivityHistoryQuery({
        ...params,
        id: props.id,
      }) as InfiniteQuery<
        HistoryEntry
      >;
    case 'episode':
      return episodeActivityHistoryQuery({
        ...params,
        id: props.id,
      }) as InfiniteQuery<
        HistoryEntry
      >;
    case 'show':
      return showActivityHistoryQuery({
        ...params,
        id: props.id,
      }) as InfiniteQuery<
        HistoryEntry
      >;
    default:
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
