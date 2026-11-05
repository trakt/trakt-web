import { describe, expect, it } from 'vitest';
import { toLocaleWeekdays } from './toLocaleWeekdays.ts';

const SUNDAY_FIRST = [0, 1, 2, 3, 4, 5, 6];

describe('util: toLocaleWeekdays', () => {
  it('should keep sunday first for a sunday-start locale', () => {
    const weekdays = toLocaleWeekdays(SUNDAY_FIRST, 'en');

    expect(weekdays.map(({ value }) => value)).toEqual(SUNDAY_FIRST);
    expect(weekdays.map(({ date }) => date.getDay())).toEqual(SUNDAY_FIRST);
  });

  it('should start on monday for a monday-start locale', () => {
    const weekdays = toLocaleWeekdays(SUNDAY_FIRST, 'de-DE');

    expect(weekdays.map(({ value }) => value)).toEqual([1, 2, 3, 4, 5, 6, 0]);
    expect(weekdays.map(({ date }) => date.getDay())).toEqual([
      1, 2, 3, 4, 5, 6, 0,
    ]);
  });
});
