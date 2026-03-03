import { describe, expect, it } from 'vitest';
import { getDaysDifference } from './getDaysDifference.ts';

describe('getDaysDifference', () => {
  it('should return 0 for the same date', () => {
    const date = new Date('2023-06-15');
    expect(getDaysDifference(date, date)).toBe(0);
  });

  it('should return 7 for dates one week apart', () => {
    const date1 = new Date('2023-06-15');
    const date2 = new Date('2023-06-22');
    expect(getDaysDifference(date1, date2)).toBe(7);
  });

  it('should return 365 for dates one year apart', () => {
    const date1 = new Date('2022-06-15');
    const date2 = new Date('2023-06-15');
    expect(getDaysDifference(date1, date2)).toBe(365);
  });

  it('should handle dates with different months and days', () => {
    const date1 = new Date('2020-03-24');
    const date2 = new Date('2020-04-01');
    expect(getDaysDifference(date1, date2)).toBe(8);
  });

  it('should handle year calculations', () => {
    const date1 = new Date('2024-12-28');
    const date2 = new Date('2025-01-02');
    expect(getDaysDifference(date1, date2)).toBe(5);
  });

  it('should ignore time components when calculating year difference', () => {
    const date1 = new Date('2023-06-15T08:30:45.123Z');
    const date2 = new Date('2023-06-20T18:45:30.987Z');
    expect(getDaysDifference(date1, date2)).toBe(5);
  });
});
