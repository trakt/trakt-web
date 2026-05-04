import type { Calendar } from '$lib/features/calendar/models/Calendar.ts';
import type { ActivityEntry } from '$lib/sections/lists/stores/models/ActivityEntry.ts';
import { createHistoryCalendar } from './createHistoryCalendar.ts';
import { groupHistoryByDay } from './groupHistoryByDay.ts';

export function mapToActivityCalendar<T>(
  items: ActivityEntry<T>[],
  startDate?: Date,
): Calendar<ActivityEntry<T>> {
  if (!startDate) return [];

  const days = groupHistoryByDay(items);
  return createHistoryCalendar(days, startDate);
}
