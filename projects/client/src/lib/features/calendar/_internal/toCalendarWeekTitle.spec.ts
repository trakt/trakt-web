import { describe, expect, it } from 'vitest';
import { toCalendarWeekTitle } from './toCalendarWeekTitle.ts';

describe('util: toCalendarWeekTitle', () => {
  const today = new Date(2026, 9, 7);

  it('should name the current week', () => {
    expect(
      toCalendarWeekTitle({ start: new Date(2026, 9, 4), today, locale: 'en' }),
    )
      .toBe('This week');
  });

  it('should name the next and previous weeks', () => {
    expect(
      toCalendarWeekTitle({
        start: new Date(2026, 9, 11),
        today,
        locale: 'en',
      }),
    )
      .toBe('Next week');
    expect(
      toCalendarWeekTitle({
        start: new Date(2026, 8, 27),
        today,
        locale: 'en',
      }),
    )
      .toBe('Last week');
  });

  it('should fall back to the date range for other weeks', () => {
    expect(
      toCalendarWeekTitle({
        start: new Date(2026, 9, 18),
        today,
        locale: 'en',
      }),
    )
      .toMatch(/^Oct 18\D+24$/);
  });
});
