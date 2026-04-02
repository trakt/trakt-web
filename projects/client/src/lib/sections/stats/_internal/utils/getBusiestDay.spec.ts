import { describe, expect, it } from 'vitest';
import { getBusiestDay } from './getBusiestDay.ts';

describe('getBusiestDay', () => {
  it('returns null for empty array', () => {
    expect(getBusiestDay([])).toBeNull();
  });

  it('finds the day of week with most entries', () => {
    const dates = [
      new Date('2024-01-15T10:00:00Z'), // Monday (1)
      new Date('2024-01-15T14:00:00Z'), // Monday (1)
      new Date('2024-01-17T10:00:00Z'), // Wednesday (3)
    ];
    const result = getBusiestDay(dates);
    expect(result).toEqual({ dayIndex: 1, count: 2 });
  });
});
