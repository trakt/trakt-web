import { describe, expect, it } from 'vitest';
import { toTodayDays } from './toTodayDays.ts';

describe('util: toTodayDays', () => {
  it('should list the last seven days, today first', () => {
    const days = toTodayDays(new Date(2026, 8, 28, 14, 0));

    expect(days.map((day) => day.key)).toEqual([
      '2026-09-28',
      '2026-09-27',
      '2026-09-26',
      '2026-09-25',
      '2026-09-24',
      '2026-09-23',
      '2026-09-22',
    ]);
    expect(days.filter((day) => day.isToday)).toHaveLength(1);
  });
});
