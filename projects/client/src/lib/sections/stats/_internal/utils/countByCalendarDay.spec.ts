import { describe, expect, it, vi } from 'vitest';

vi.mock('$lib/features/i18n/messages.ts', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    text_stats_today: () => 'Today',
  };
});

import { countByCalendarDay } from './countByCalendarDay.ts';

describe('countByCalendarDay', () => {
  it('returns 7 days of data', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const result = countByCalendarDay({ dates: [], now, locale: 'en' });
    expect(result.days).toHaveLength(7);
    expect(result.labels).toHaveLength(7);
  });

  it('counts dates into correct day buckets', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-15T10:00:00Z'), // today
      new Date('2024-01-15T14:00:00Z'), // today again
      new Date('2024-01-14T10:00:00Z'), // yesterday
    ];
    const result = countByCalendarDay({ dates, now, locale: 'en' });
    expect(result.days[6]).toBe(2); // today = last slot
    expect(result.days[5]).toBe(1); // yesterday
  });

  it('ignores dates outside the 7-day window', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const dates = [
      new Date('2024-01-07T10:00:00Z'), // 8 days ago, outside window
    ];
    const result = countByCalendarDay({ dates, now, locale: 'en' });
    expect(result.days.every((d) => d === 0)).toBe(true);
  });
});
