import type { Calendar } from '$lib/features/calendar/models/Calendar.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';

const DAYS_IN_WEEK = 7;

type ActivityEntry<T> = T & ({ watchedAt: Date } | { activityAt: Date });

function getActivityTime<T>(entry: ActivityEntry<T>): Date {
  if ('watchedAt' in entry) {
    return entry.watchedAt;
  }

  return entry.activityAt;
}

function groupHistoryByDay<T>(items: ActivityEntry<T>[]) {
  return items.reduce((groups, item) => {
    const key = getDayKey(getActivityTime(item));
    const group = groups.get(key) ?? [];

    group.push(item);
    groups.set(key, group);

    return groups;
  }, new Map<string, ActivityEntry<T>[]>());
}

function createHistoryCalendar<T>(
  groups: Map<string, ActivityEntry<T>[]>,
  startDate: Date,
) {
  if (!startDate) return [];

  return Array.from({ length: DAYS_IN_WEEK })
    .map((_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const key = getDayKey(date);
      const items = groups.get(key) ?? [];

      return {
        date,
        items: items.toSorted((a, b) =>
          getActivityTime(a).getTime() - getActivityTime(b).getTime()
        ),
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function mapToActivityCalendar<T>(
  items: ActivityEntry<T>[],
  startDate?: Date,
): Calendar<ActivityEntry<T>> {
  if (!startDate) return [];

  const days = groupHistoryByDay(items);
  return createHistoryCalendar(days, startDate);
}
