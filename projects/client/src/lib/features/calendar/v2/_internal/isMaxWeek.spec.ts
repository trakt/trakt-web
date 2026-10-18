import { describe, expect, it } from 'vitest';
import { isMaxWeek } from './isMaxWeek.ts';

describe('util: isMaxWeek', () => {
  const sunday = new Date(2026, 9, 11);
  const monday = new Date(2026, 9, 12);

  it('should be false without a max date', () => {
    expect(isMaxWeek({ date: monday, locale: 'en' })).toBe(false);
  });

  it('should use Sunday-first weeks for en', () => {
    expect(isMaxWeek({ date: sunday, maxDate: monday, locale: 'en' })).toBe(
      true,
    );
  });

  it('should use Monday-first weeks for a Monday-first locale', () => {
    expect(isMaxWeek({ date: sunday, maxDate: monday, locale: 'nl-NL' })).toBe(
      false,
    );
  });
});
