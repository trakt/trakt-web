import { describe, expect, it } from 'vitest';
import { toHumanClockTime } from './toHumanClockTime.ts';

describe('toHumanClockTime', () => {
  it('should format a time with hour and minute in English by default', () => {
    const date = new Date(2026, 3, 20, 14, 30);
    expect(toHumanClockTime(date)).toBe('2:30 PM');
  });

  it('should pad single-digit minutes with a leading zero', () => {
    const date = new Date(2026, 3, 20, 9, 5);
    expect(toHumanClockTime(date)).toBe('9:05 AM');
  });
});
