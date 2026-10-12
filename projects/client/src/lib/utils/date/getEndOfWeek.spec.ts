import { describe, expect, it } from 'vitest';
import { getEndOfWeek } from './getEndOfWeek.ts';

describe('getEndOfWeek', () => {
  it('should end the week on Saturday for en', () => {
    const result = getEndOfWeek(new Date('2023-12-17'), 'en');

    expect(result.toDateString()).toBe('Sat Dec 23 2023');
  });

  it('should handle the year boundary', () => {
    const result = getEndOfWeek(new Date('2023-12-31'), 'en');

    expect(result.toDateString()).toBe('Sat Jan 06 2024');
  });

  it('should end the week on Sunday for a Monday-first locale', () => {
    const result = getEndOfWeek(new Date('2023-12-17'), 'nl-NL');

    expect(result.toDateString()).toBe('Sun Dec 17 2023');
  });

  it('should end at the last millisecond of the day', () => {
    const result = getEndOfWeek(new Date('2023-12-17'), 'en');

    expect(result.getHours()).toBe(23);
    expect(result.getMilliseconds()).toBe(999);
  });
});
