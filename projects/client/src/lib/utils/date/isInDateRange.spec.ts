import { describe, expect, it } from 'vitest';
import { isInDateRange } from './isInDateRange.ts';

describe('isInDateRange', () => {
  it('returns true when date is within the range', () => {
    const start = new Date(2023, 0, 1);
    const end = new Date(2023, 0, 31);
    const date = new Date(2023, 0, 15);
    expect(isInDateRange(date, start, end)).toBe(true);
  });

  it('returns true when date is exactly the start', () => {
    const start = new Date(2023, 0, 1);
    const end = new Date(2023, 0, 31);
    expect(isInDateRange(start, start, end)).toBe(true);
  });

  it('returns true when date is exactly the end', () => {
    const start = new Date(2023, 0, 1);
    const end = new Date(2023, 0, 31);
    expect(isInDateRange(end, start, end)).toBe(true);
  });

  it('returns false when date is before the start', () => {
    const start = new Date(2023, 0, 2);
    const end = new Date(2023, 0, 31);
    const date = new Date(2023, 0, 1);
    expect(isInDateRange(date, start, end)).toBe(false);
  });

  it('returns false when date is after the end', () => {
    const start = new Date(2023, 0, 1);
    const end = new Date(2023, 0, 31);
    const date = new Date(2023, 1, 1);
    expect(isInDateRange(date, start, end)).toBe(false);
  });
});
