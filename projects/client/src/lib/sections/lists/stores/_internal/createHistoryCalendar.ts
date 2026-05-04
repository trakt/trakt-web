import type { ActivityEntry } from '$lib/sections/lists/stores/models/ActivityEntry.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { getActivityTime } from './getActivityTime.ts';

const daysInWeek = 7;

export function createHistoryCalendar<T>(
  groups: Map<string, ActivityEntry<T>[]>,
  startDate: Date,
) {
  if (!startDate) return [];

  return Array.from({ length: daysInWeek })
    .map((_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const key = getDayKey(date);
      const items = groups.get(key) ?? [];

      return {
        date,
        items: items.toSorted((a, b) =>
          getActivityTime(b).getTime() - getActivityTime(a).getTime()
        ),
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
