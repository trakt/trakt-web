import { addWeeks } from 'date-fns/addWeeks';
import { describe, expect, it } from 'vitest';
import { toCalendarDateValue } from './toCalendarDateValue.ts';

describe('util: toCalendarDateValue', () => {
  it('should format a date outside the current week', () => {
    expect(toCalendarDateValue(new Date(2020, 0, 5), 'en')).toBe('2020-01-05');
  });

  it('should drop dates in the current week', () => {
    expect(toCalendarDateValue(new Date(), 'en')).toBeNull();
  });

  it('should keep the next week', () => {
    expect(toCalendarDateValue(addWeeks(new Date(), 1), 'en')).not.toBeNull();
  });
});
