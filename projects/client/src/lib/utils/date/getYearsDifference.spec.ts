import { describe, expect, it } from 'vitest';
import { getYearsDifference } from './getYearsDifference.ts';

describe('getYearsDifference', () => {
  it('should return 0 for the same date', () => {
    const date = new Date('2023-06-15');
    expect(getYearsDifference(date, date)).toBe(0);
  });

  it('should return 1 for dates exactly one year apart', () => {
    const date1 = new Date('2023-06-15');
    const date2 = new Date('2024-06-15');
    expect(getYearsDifference(date1, date2)).toBe(1);
  });

  it('should return absolute difference regardless of date order', () => {
    const date1 = new Date('2023-06-15');
    const date2 = new Date('2025-06-15');
    expect(getYearsDifference(date1, date2)).toBe(2);
    expect(getYearsDifference(date2, date1)).toBe(2);
  });

  it('should handle dates with different months and days', () => {
    const date1 = new Date('2020-03-10');
    const date2 = new Date('2023-08-25');
    expect(getYearsDifference(date1, date2)).toBe(3);
  });

  it('should handle leap year calculations', () => {
    const date1 = new Date('2024-02-29');
    const date2 = new Date('2028-02-29');
    expect(getYearsDifference(date1, date2)).toBe(4);
  });

  it('should handle century transitions', () => {
    const date1 = new Date('1999-12-31');
    const date2 = new Date('2001-01-01');
    expect(getYearsDifference(date1, date2)).toBe(1);
  });

  it('should handle large year differences', () => {
    const date1 = new Date('1950-01-01');
    const date2 = new Date('2023-01-01');
    expect(getYearsDifference(date1, date2)).toBe(73);
  });

  it('should ignore time components when calculating year difference', () => {
    const date1 = new Date('2020-06-15T08:30:45.123Z');
    const date2 = new Date('2023-06-15T18:45:30.987Z');
    expect(getYearsDifference(date1, date2)).toBe(3);
  });

  it('should handle partial year differences correctly', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-12-31');
    expect(getYearsDifference(date1, date2)).toBe(0);
  });

  it('should handle dates where one year has not fully passed', () => {
    const date1 = new Date('2023-06-15');
    const date2 = new Date('2024-06-14');
    expect(getYearsDifference(date1, date2)).toBe(0);
  });

  it('should handle dates across multiple decades', () => {
    const date1 = new Date('1980-05-20');
    const date2 = new Date('2020-05-20');
    expect(getYearsDifference(date1, date2)).toBe(40);
  });
});
