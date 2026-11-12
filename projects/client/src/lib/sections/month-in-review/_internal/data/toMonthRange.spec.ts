import { describe, expect, it } from 'vitest';
import { toMonthRange } from './toMonthRange.ts';

describe('util: toMonthRange', () => {
  it('should span from the first of the month to the first of the next', () => {
    expect(toMonthRange({ year: 2026, month: 10 })).toEqual({
      startDate: new Date(2026, 9, 1),
      endDate: new Date(2026, 10, 1),
    });
  });

  it('should roll over into the next year for december', () => {
    expect(toMonthRange({ year: 2026, month: 12 }).endDate).toEqual(
      new Date(2027, 0, 1),
    );
  });
});
