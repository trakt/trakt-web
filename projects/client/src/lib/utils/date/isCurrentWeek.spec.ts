import { describe, expect, it } from 'vitest';
import { isCurrentWeek } from './isCurrentWeek.ts';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

describe('isCurrentWeek', () => {
  it('returns true for today', () => {
    const today = new Date();

    expect(isCurrentWeek(today, 'en')).toBe(true);
  });

  it('returns true for the start of current week (Sunday)', () => {
    const today = new Date();
    const sunday = addDays(today, -today.getDay());

    expect(isCurrentWeek(sunday, 'en')).toBe(true);
  });

  it('returns true for the end of current week (Saturday)', () => {
    const today = new Date();
    const saturday = addDays(today, 6 - today.getDay());

    expect(isCurrentWeek(saturday, 'en')).toBe(true);
  });

  it('returns false for last week', () => {
    const today = new Date();
    const lastWeek = addWeeks(today, -1);

    expect(isCurrentWeek(lastWeek, 'en')).toBe(false);
  });

  it('returns false for next week', () => {
    const today = new Date();
    const nextWeek = addWeeks(today, 1);

    expect(isCurrentWeek(nextWeek, 'en')).toBe(false);
  });

  it('returns false for a date 2 weeks ago', () => {
    const today = new Date();
    const twoWeeksAgo = addWeeks(today, -2);

    expect(isCurrentWeek(twoWeeksAgo, 'en')).toBe(false);
  });

  it('returns false for a date 2 weeks in the future', () => {
    const today = new Date();
    const twoWeeksFromNow = addWeeks(today, 2);

    expect(isCurrentWeek(twoWeeksFromNow, 'en')).toBe(false);
  });

  it('works with different locales', () => {
    const today = new Date();

    expect(isCurrentWeek(today, 'de-de')).toBe(true);
    expect(isCurrentWeek(today, 'fr-fr')).toBe(true);
  });
});
