import { describe, expect, it } from 'vitest';
import { getPastMonthRange } from './getPastMonthRange.ts';

describe('getPastMonthRange', () => {
  it('should return the month range', () => {
    const range = getPastMonthRange(new Date('2023-12-20'));

    expect(range).toEqual({
      startDate: new Date('2023-11-20'),
      endDate: new Date('2023-12-20'),
    });
  });

  it('should keep the hours in tact', () => {
    const range = getPastMonthRange(new Date('2023-12-20T13:37:00Z'));

    expect(range).toEqual({
      startDate: new Date('2023-11-20T13:37:00Z'),
      endDate: new Date('2023-12-20T13:37:00Z'),
    });
  });
});
