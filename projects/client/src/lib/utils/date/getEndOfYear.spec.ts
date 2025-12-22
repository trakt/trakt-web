import { describe, expect, it } from 'vitest';
import { getEndOfYear } from './getEndOfYear.ts';

describe('getEndOfYear', () => {
  it('returns December 31st for a mid-year date', () => {
    const date = new Date(2023, 5, 15);
    const result = getEndOfYear(date);
    expect(result.getFullYear()).toBe(2023);
    expect(result.getMonth()).toBe(11);
    expect(result.getDate()).toBe(31);
  });

  it('returns December 31st for a date already in December', () => {
    const date = new Date(2023, 11, 1);
    const result = getEndOfYear(date);
    expect(result.getFullYear()).toBe(2023);
    expect(result.getMonth()).toBe(11);
    expect(result.getDate()).toBe(31);
  });

  it('handles leap years correctly', () => {
    const date = new Date(2024, 0, 1);
    const result = getEndOfYear(date);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(11);
    expect(result.getDate()).toBe(31);
  });

  it('returns correct time at end of year', () => {
    const date = new Date(2025, 7, 10, 12, 0, 0);
    const result = getEndOfYear(date);
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
    expect(result.getMilliseconds()).toBe(999);
  });
});
