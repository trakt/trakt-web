import { describe, expect, it } from 'vitest';
import { isSameDayOfYear } from './isSameDayOfYear.ts';

describe('isSameDayOfYear', () => {
  it('should return true for the same date', () => {
    const date = new Date('2023-06-15');
    expect(isSameDayOfYear(date, date)).toBe(true);
  });

  it('should return true for same month and day in different years', () => {
    const date1 = new Date('2023-06-15');
    const date2 = new Date('2024-06-15');
    expect(isSameDayOfYear(date1, date2)).toBe(true);
  });

  it('should return true for same month and day with different times', () => {
    const date1 = new Date('2023-06-15T08:30:00');
    const date2 = new Date('2025-06-15T18:45:30');
    expect(isSameDayOfYear(date1, date2)).toBe(true);
  });

  it('should return false for different months', () => {
    const date1 = new Date('2023-06-15');
    const date2 = new Date('2023-07-15');
    expect(isSameDayOfYear(date1, date2)).toBe(false);
  });

  it('should return false for different days', () => {
    const date1 = new Date('2023-06-15');
    const date2 = new Date('2023-06-16');
    expect(isSameDayOfYear(date1, date2)).toBe(false);
  });

  it('should return false for different month and day', () => {
    const date1 = new Date('2023-06-15');
    const date2 = new Date('2023-07-16');
    expect(isSameDayOfYear(date1, date2)).toBe(false);
  });

  it('should handle leap year dates correctly', () => {
    const date1 = new Date('2024-02-29');
    const date2 = new Date('2020-02-29');
    expect(isSameDayOfYear(date1, date2)).toBe(true);
  });
});
