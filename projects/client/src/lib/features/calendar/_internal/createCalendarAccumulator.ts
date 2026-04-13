import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import type { Calendar } from '../models/Calendar.ts';
import type { CalendarPeriod } from '../models/CalendarLayoutProps.ts';
import type { CalendarOrder } from '../models/CalendarOrder.ts';

const emptyPeriodLimit = 5;

function sortPeriods<T>(
  periods: ReadonlyArray<CalendarPeriod<T>>,
  order: CalendarOrder,
): CalendarPeriod<T>[] {
  const sorted = [...periods].sort((a, b) => {
    const dateA = a.calendar.at(0)?.date.getTime() ?? 0;
    const dateB = b.calendar.at(0)?.date.getTime() ?? 0;
    return dateA - dateB;
  });

  return order === 'reverse-chronological' ? sorted.toReversed() : sorted;
}

type AccumulatorParams<T> = {
  calendar: Calendar<T>;
  fingerprint: string;
};

export function createCalendarAccumulator(order: CalendarOrder) {
  const accumulatedMap = new Map<string, Calendar<unknown>>();
  let lastFingerprint: string | undefined;
  let clearedToKey: string | undefined;
  let consecutiveEmptyPeriods = 0;

  function setPeriodCount(isEmpty: boolean) {
    if (isEmpty) {
      consecutiveEmptyPeriods++;
      return;
    }
    consecutiveEmptyPeriods = 0;
  }

  function clear(targetDate?: Date) {
    accumulatedMap.clear();
    lastFingerprint = undefined;
    clearedToKey = targetDate ? getDayKey(targetDate) : undefined;
    consecutiveEmptyPeriods = 0;
  }

  function accumulate<T>({
    calendar,
    fingerprint,
  }: AccumulatorParams<T>): CalendarPeriod<T>[] {
    if (fingerprint != null && fingerprint !== lastFingerprint) {
      accumulatedMap.clear();
      lastFingerprint = fingerprint;
      consecutiveEmptyPeriods = 0;
    }

    const firstDay = calendar.at(0);
    if (firstDay) {
      const key = getDayKey(firstDay.date);

      if (clearedToKey && key !== clearedToKey) {
        return sortPeriods(
          Array.from(
            accumulatedMap,
            ([k, cal]) => ({ key: k, calendar: cal as Calendar<T> }),
          ),
          order,
        );
      }

      clearedToKey = undefined;

      const isEmpty = calendar.every((day) => day.items.length === 0);

      if (!accumulatedMap.has(key) || !isEmpty) {
        setPeriodCount(isEmpty);
      }

      accumulatedMap.set(key, calendar);
    }

    return sortPeriods(
      Array.from(
        accumulatedMap,
        ([key, cal]) => ({ key, calendar: cal as Calendar<T> }),
      ),
      order,
    );
  }

  function canLoadMore(): boolean {
    return consecutiveEmptyPeriods < emptyPeriodLimit;
  }

  return { accumulate, clear, canLoadMore };
}
