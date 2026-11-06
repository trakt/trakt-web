import { describe, expect, it } from 'vitest';
import { toMonthRange } from './toMonthRange.ts';

describe('util: toMonthRange', () => {
  it('should span from the first midnight to the last millisecond of the month', () => {
    const { startDate, endDate } = toMonthRange(new Date(2026, 9, 17));

    expect(startDate).toEqual(new Date(2026, 9, 1, 0, 0, 0, 0));
    expect(endDate).toEqual(new Date(2026, 9, 31, 23, 59, 59, 999));
  });

  it('should end on the 29th in a leap February', () => {
    const { endDate } = toMonthRange(new Date(2024, 1, 3));

    expect(endDate.getDate()).toBe(29);
    expect(endDate.getMonth()).toBe(1);
  });

  it('should stay inside December instead of rolling into the next year', () => {
    const { startDate, endDate } = toMonthRange(new Date(2025, 11, 25));

    expect(startDate).toEqual(new Date(2025, 11, 1));
    expect(endDate.getFullYear()).toBe(2025);
    expect(endDate.getMonth()).toBe(11);
    expect(endDate.getDate()).toBe(31);
  });
});
