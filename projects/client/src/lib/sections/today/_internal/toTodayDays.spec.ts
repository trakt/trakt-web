import { describe, expect, it } from 'vitest';
import { toTodayDays } from './toTodayDays.ts';

describe('util: toTodayDays', () => {
  it('should offer today, yesterday and the past week', () => {
    const days = toTodayDays(new Date(2026, 8, 28, 14, 0));

    expect(days.map((day) => [day.kind, day.key])).toEqual([
      ['today', '2026-09-28'],
      ['yesterday', '2026-09-27'],
      ['week', 'week'],
    ]);
    expect(days.filter((day) => day.isToday)).toHaveLength(1);
  });
});
