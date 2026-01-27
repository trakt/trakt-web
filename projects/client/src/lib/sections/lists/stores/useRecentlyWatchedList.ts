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
import { startOfDay } from 'date-fns';
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

type PlaceholderItem = {
  type: 'placeholder';
  endDate?: Date;
};

export type HistoryCalendar = {
  date: Date;
} & (HistoryItem | PlaceholderItem);

// TODO: extract util; replace one in tests
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

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

export function useRecentlyWatchedList(
  params: RecentlyWatchedListStoreProps,
) {
  const { list, ...rest } = usePaginatedListQuery(typeToQuery(params));

  const historyCalendarItems = list.pipe(
    map((items) => {
      // TODO improve code, extract, and test
      const groups = new Map<string, HistoryEntry[]>();

      for (const item of items) {
        const key = getDayKey(item.watchedAt);
        const group = groups.get(key) ?? [];
        group.push(item);
        groups.set(key, group);
      }

      const now = new Date();
      const defaultStart = addDays(now, -14);
      const start = startOfDay(params.startDate ?? defaultStart);
      const end = startOfDay(params.endDate ?? now);

      const result: HistoryCalendar[] = [];

      let current = start;
      let placeholderStart: Date | null = null;

      while (current <= end) {
        const key = getDayKey(current);
        const groupItems = groups.get(key);

        if (groupItems) {
          if (placeholderStart) {
            const placeholderEnd = addDays(current, -1);
            const isSingleDay = getDayKey(placeholderStart) ===
              getDayKey(placeholderEnd);

            result.push({
              date: placeholderStart,
              type: 'placeholder',
              ...(isSingleDay ? {} : { endDate: placeholderEnd }),
            });
            placeholderStart = null;
          }

          result.push({
            date: current,
            items: groupItems,
            type: 'history',
          });
        } else {
          if (!placeholderStart) {
            placeholderStart = current;
          }
        }
        current = addDays(current, 1);
      }

      if (placeholderStart) {
        const placeholderEnd = addDays(current, -1);
        const isSingleDay = getDayKey(placeholderStart) ===
          getDayKey(placeholderEnd);

        result.push({
          date: placeholderStart,
          type: 'placeholder',
          ...(isSingleDay ? {} : { endDate: placeholderEnd }),
        });
      }

      return result;
    }),
  );

  return { list, historyCalendarItems, ...rest };
}
