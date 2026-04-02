import { describe, expect, it } from 'vitest';
import { dayOfWeekDate } from './dayOfWeekDate.ts';

describe('dayOfWeekDate', () => {
  it('returns a date matching the given day of week', () => {
    const now = new Date('2024-01-17T12:00:00Z');
    const result = dayOfWeekDate(1, now);
    expect(result.getDay()).toBe(1);
  });

  it('returns same day when dayIndex matches now', () => {
    const now = new Date('2024-01-17T12:00:00Z');
    const result = dayOfWeekDate(3, now);
    expect(result.getDay()).toBe(3);
  });
});
