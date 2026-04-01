import { describe, expect, it } from 'vitest';
import { toHumanHour } from './toHumanHour.ts';

describe('toHumanHour', () => {
  it('should format an hour in English by default', () => {
    const date = new Date(2026, 3, 20, 15, 0);
    expect(toHumanHour(date)).toBe('3 PM');
  });

  it('should format midnight correctly', () => {
    const date = new Date(2026, 3, 20, 0, 0);
    expect(toHumanHour(date)).toBe('12 AM');
  });
});
