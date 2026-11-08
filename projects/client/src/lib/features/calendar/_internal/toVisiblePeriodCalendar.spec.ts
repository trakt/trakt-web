import { describe, expect, it } from 'vitest';
import type { CalendarPeriod } from '../models/CalendarPeriod.ts';
import { toVisiblePeriodCalendar } from './toVisiblePeriodCalendar.ts';

function toPeriod(key: string, days: number[]): CalendarPeriod<string> {
  return {
    key,
    calendar: days.map((day) => ({ date: new Date(2026, 9, day), items: [] })),
  };
}

describe('util: toVisiblePeriodCalendar', () => {
  const first = toPeriod('first', [18, 19, 20]);
  const second = toPeriod('second', [11, 12, 13]);
  const periods = [first, second];

  it('should return an empty calendar without periods', () => {
    expect(toVisiblePeriodCalendar({ periods: [], visibleDate: null })).toEqual(
      [],
    );
  });

  it('should return the first period without a visible date', () => {
    expect(toVisiblePeriodCalendar({ periods, visibleDate: null })).toBe(
      first.calendar,
    );
  });

  it('should return the period containing the visible date', () => {
    const result = toVisiblePeriodCalendar({
      periods,
      visibleDate: new Date(2026, 9, 12),
    });

    expect(result).toBe(second.calendar);
  });

  it('should fall back to the first period when no period has the date', () => {
    const result = toVisiblePeriodCalendar({
      periods,
      visibleDate: new Date(2026, 9, 1),
    });

    expect(result).toBe(first.calendar);
  });
});
