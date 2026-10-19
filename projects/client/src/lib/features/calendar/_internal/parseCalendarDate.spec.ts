import { describe, expect, it } from 'vitest';
import { parseCalendarDate } from './parseCalendarDate.ts';

describe('util: parseCalendarDate', () => {
  it('should parse a calendar date as a local day', () => {
    const date = parseCalendarDate('2026-11-08');

    expect(date?.toDateString()).toBe('Sun Nov 08 2026');
  });

  it('should ignore a missing value', () => {
    expect(parseCalendarDate(null)).toBeNull();
  });

  it('should ignore values that are not a calendar date', () => {
    expect(parseCalendarDate('2026-11-08T10:00')).toBeNull();
    expect(parseCalendarDate('next-week')).toBeNull();
    expect(parseCalendarDate('2026-13-40')).toBeNull();
  });
});
