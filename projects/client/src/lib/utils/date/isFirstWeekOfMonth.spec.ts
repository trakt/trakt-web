import { describe, expect, it } from 'vitest';
import { isFirstWeekOfMonth } from './isFirstWeekOfMonth.ts';

describe('isFirstWeekOfMonth', () => {
  it('should return true for the first day of month', () => {
    const date = new Date(2023, 0, 1);
    expect(isFirstWeekOfMonth(date)).toBe(true);
  });

  it('should return true for days in the first week of month', () => {
    const date = new Date(2023, 0, 6);
    expect(isFirstWeekOfMonth(date)).toBe(true);
  });

  it('should return false for days outside the first week of month', () => {
    const date = new Date(2023, 0, 10);
    expect(isFirstWeekOfMonth(date)).toBe(false);
  });

  it('should handle month that starts on Sunday', () => {
    const date = new Date(2023, 10, 5);
    expect(isFirstWeekOfMonth(date)).toBe(true);
  });

  it('should handle month that starts on Monday', () => {
    const date = new Date(2023, 4, 6);
    expect(isFirstWeekOfMonth(date)).toBe(true);
  });

  it('should handle last day of the first week', () => {
    const date = new Date(2023, 6, 7);
    expect(isFirstWeekOfMonth(date)).toBe(true);
  });

  it('should handle first day of the second week', () => {
    const date = new Date(2023, 6, 8);
    expect(isFirstWeekOfMonth(date)).toBe(false);
  });

  it('should handle dates from previous month included in the first week', () => {
    const firstDay = new Date(2023, 3, 1);
    const prevMonthDate = new Date(2023, 2, 30);

    const firstWeekStart = firstDay.getDate() - firstDay.getDay();
    expect(firstWeekStart).toBeLessThan(1);
    expect(isFirstWeekOfMonth(prevMonthDate)).toBe(false);
  });
});
