import { describe, expect, it, vi } from 'vitest';

vi.mock('$lib/features/i18n/messages.ts', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    text_stats_weeks_ago: ({ count }: { count: string }) => `${count}w ago`,
    text_stats_weeks_short: ({ count }: { count: string }) => `${count}w`,
    text_stats_this_week: () => 'This week',
  };
});

import { computeWeekTrend } from './computeWeekTrend.ts';

describe('computeWeekTrend', () => {
  it('returns 4 weeks of data', () => {
    const now = new Date('2024-01-28T12:00:00Z');
    const result = computeWeekTrend([], now);
    expect(result).toHaveLength(4);
    result.forEach((week) => expect(week.plays).toBe(0));
  });
});
