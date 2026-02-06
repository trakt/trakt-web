import { activityHistoryQuery } from '$lib/requests/queries/users/activityHistoryQuery.ts';
import {
  type EpisodeActivityHistory,
  episodeActivityHistoryQuery,
} from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import {
  type MovieActivityHistory,
  movieActivityHistoryQuery,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import {
  type ShowActivityHistory,
  showActivityHistoryQuery,
} from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { addDays } from 'date-fns';
import { map } from 'rxjs';
import type { InfiniteQuery } from '../../../features/query/models/InfiniteQuery.ts';

export type RecentlyWatchedType = 'movie' | 'show' | 'episode' | 'all';

type RecentlyWatchedListStoreProps = {
  type: RecentlyWatchedType;
  slug?: string;
  id?: number;
  startDate?: Date;
  endDate?: Date;
};

export type HistoryEntry =
  | MovieActivityHistory
  | ShowActivityHistory
  | EpisodeActivityHistory;

type HistoryItem = {
  type: 'history';
  items: HistoryEntry[];
};

export type HistoryCalendar = {
  date: Date;
} & HistoryItem;

function typeToQuery(
  { type, id, slug, startDate, endDate }: RecentlyWatchedListStoreProps,
) {
  const now = new Date();
  const then = addDays(now, -14);

  const params = {
    limit: 'all',
    id,
    slug: slug ?? 'me',
    // TODO enforce date params
    startDate: startDate ?? then,
    endDate: endDate ?? now,
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

function groupHistoryByDay(items: HistoryEntry[]) {
  return items.reduce((groups, item) => {
    const key = getDayKey(item.watchedAt);
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
    return groups;
  }, new Map<string, HistoryEntry[]>());
}

function createHistoryCalendar(groups: Map<string, HistoryEntry[]>) {
  return Array.from(groups.entries())
    .map(([key, items]): HistoryCalendar => {
      const [year, month, day] = key.split('-').map(Number) as [
        number,
        number,
        number,
      ];
      return {
        date: new Date(year, month - 1, day),
        items,
        type: 'history',
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function useRecentlyWatchedList(
  params: RecentlyWatchedListStoreProps,
) {
  const { list, ...rest } = usePaginatedListQuery(typeToQuery(params));

  const historyCalendarItems = list.pipe(
    map((items) => {
      const groups = groupHistoryByDay(items);
      return createHistoryCalendar(groups);
    }),
  );

  return { list, historyCalendarItems, ...rest };
}
