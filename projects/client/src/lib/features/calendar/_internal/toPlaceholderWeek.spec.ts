import { describe, expect, it } from 'vitest';
import { toPlaceholderWeek } from './toPlaceholderWeek.ts';

describe('util: toPlaceholderWeek', () => {
  it('should return the empty week around the date', () => {
    const week = toPlaceholderWeek(new Date(2026, 9, 21), 'en');

    expect(week.map((day) => day.date.getDate())).toEqual([
      18, 19, 20, 21, 22, 23, 24,
    ]);
    expect(week.every((day) => day.items.length === 0)).toBe(true);
  });

  it('should start on Monday for a Monday-first locale', () => {
    const week = toPlaceholderWeek(new Date(2026, 9, 21), 'nl-NL');

    expect(week.at(0)?.date.toDateString()).toBe('Mon Oct 19 2026');
  });
});
