import type { Calendar } from '$lib/features/calendar/models/Calendar.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import type { HistoryEntry } from '../models/HistoryEntry.ts';

const DAYS_IN_WEEK = 7;

type ActivityEntry = HistoryEntry;

function groupHistoryByDay(items: ActivityEntry[]) {
  return items.reduce((groups, item) => {
    const key = getDayKey(item.watchedAt);
    const group = groups.get(key) ?? [];

    group.push(item);
    groups.set(key, group);

    return groups;
  }, new Map<string, ActivityEntry[]>());
}

function createHistoryCalendar(
  groups: Map<string, ActivityEntry[]>,
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
        items,
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function mapToActivityCalendar(
  items: ActivityEntry[],
  startDate?: Date,
): Calendar<ActivityEntry> {
  if (!startDate) return [];

  const days = groupHistoryByDay(items);
  return createHistoryCalendar(days, startDate);
}
