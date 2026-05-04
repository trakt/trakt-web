import type { CalendarPeriod } from '$lib/features/calendar/models/CalendarLayoutProps.ts';
import { getLocale } from '$lib/features/i18n/index.ts';
import type { ActivityEntry } from '$lib/sections/lists/stores/models/ActivityEntry.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { createHistoryCalendar } from './createHistoryCalendar.ts';
import { getActivityTime } from './getActivityTime.ts';
import { groupHistoryByDay } from './groupHistoryByDay.ts';

type WeekGroup<T> = {
  weekStart: Date;
  items: ActivityEntry<T>[];
};

function groupItemsByWeek<T>(
  items: ActivityEntry<T>[],
): Map<string, WeekGroup<T>> {
  return items.reduce((weeks, item) => {
    const activityDate = getActivityTime(item);
    const weekStart = getStartOfWeek(activityDate, getLocale());
    const weekKey = getDayKey(weekStart);
    const existing = weeks.get(weekKey) ?? { weekStart, items: [] };
    existing.items.push(item);
    weeks.set(weekKey, existing);
    return weeks;
  }, new Map<string, WeekGroup<T>>());
}

export function mapToCalendarPeriods<T>(
  items: ActivityEntry<T>[],
): CalendarPeriod<ActivityEntry<T>>[] {
  if (!items.length) return [];

  const weekGroups = groupItemsByWeek(items);

  return Array.from(weekGroups.values())
    .map(({ weekStart, items: weekItems }) => {
      const groups = groupHistoryByDay(weekItems);
      const calendar = createHistoryCalendar(groups, weekStart);
      return { key: `period-${weekStart.getTime()}`, calendar };
    })
    .toSorted((a, b) => {
      const dateB = b.calendar.at(0)?.date.getTime() ?? 0;
      const dateA = a.calendar.at(0)?.date.getTime() ?? 0;
      return dateB - dateA;
    });
}
