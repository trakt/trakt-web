import { describe, expect, it } from 'vitest';
import { toHumanDayOfMonth } from './toHumanDayOfMonth.ts';

describe('toHumanDayOfMonth', () => {
  it('should display the day of the month without padding', () => {
    expect(toHumanDayOfMonth(new Date(2023, 11, 3), 'en')).toBe('3');
  });

  it('should display the last day of the month', () => {
    expect(toHumanDayOfMonth(new Date(2023, 11, 31), 'en')).toBe('31');
  });
});
