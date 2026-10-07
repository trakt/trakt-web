import { describe, expect, it } from 'vitest';
import { isUnknownDate } from './isUnknownDate.ts';

describe('isUnknownDate', () => {
  it('should return true for the unix epoch', () => {
    expect(isUnknownDate(new Date(0))).toBe(true);
  });

  it('should return true for any time on the first day of 1970 in UTC', () => {
    expect(isUnknownDate(new Date('1970-01-01T23:59:59.000Z'))).toBe(true);
  });

  it('should return false for the day before the epoch in UTC', () => {
    expect(isUnknownDate(new Date('1969-12-31T23:59:59.000Z'))).toBe(false);
  });

  it('should return false for the day after the epoch in UTC', () => {
    expect(isUnknownDate(new Date('1970-01-02T00:00:00.000Z'))).toBe(false);
  });

  it('should return false for the same day in a different year', () => {
    expect(isUnknownDate(new Date('2024-01-01T00:00:00.000Z'))).toBe(false);
  });
});
