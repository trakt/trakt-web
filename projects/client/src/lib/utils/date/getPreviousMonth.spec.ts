import { describe, expect, it } from 'vitest';
import { getPreviousMonth } from './getPreviousMonth.ts';

describe('getPreviousMonth', () => {
  it('should return the previous month when given a date', () => {
    const now = new Date('2023-07-15');
    const result = getPreviousMonth(now);
    expect(result.getMonth()).toBe(5);
    expect(result.getFullYear()).toBe(2023);
    expect(result.getDate()).toBe(15);
  });

  it('should return December of previous year when current month is January', () => {
    const january = new Date('2023-01-10');
    const result = getPreviousMonth(january);
    expect(result.getMonth()).toBe(11);
    expect(result.getFullYear()).toBe(2022);
    expect(result.getDate()).toBe(10);
  });

  it('should handle leap year date correctly', () => {
    const marchLeapYear = new Date('2020-03-29');
    const result = getPreviousMonth(marchLeapYear);
    expect(result.getMonth()).toBe(1);
    expect(result.getFullYear()).toBe(2020);
    expect(result.getDate()).toBe(29);
  });

  it('should not modify the original date object', () => {
    const original = new Date('2023-05-20');
    const originalMonth = original.getMonth();
    const originalYear = original.getFullYear();

    getPreviousMonth(original);

    expect(original.getMonth()).toBe(originalMonth);
    expect(original.getFullYear()).toBe(originalYear);
  });
});
