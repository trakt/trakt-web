import { describe, expect, it } from 'vitest';
import { toHumanWeekdayDate } from './toHumanWeekdayDate.ts';

describe('util: toHumanWeekdayDate', () => {
  it('should include the weekday, day and month', () => {
    expect(toHumanWeekdayDate(new Date(2026, 9, 5), 'en')).toBe(
      'Monday, October 5',
    );
  });
});
