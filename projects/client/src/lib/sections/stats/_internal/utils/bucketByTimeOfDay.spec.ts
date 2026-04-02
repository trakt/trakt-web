import { describe, expect, it, vi } from 'vitest';

vi.mock('$lib/features/i18n/messages.ts', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    text_stats_time_morning: () => 'Morning',
    text_stats_time_afternoon: () => 'Afternoon',
    text_stats_time_evening: () => 'Evening',
    text_stats_time_late_night: () => 'Late Night',
  };
});

import { bucketByTimeOfDay } from './bucketByTimeOfDay.ts';

describe('bucketByTimeOfDay', () => {
  it('returns 4 time buckets with zero counts for empty input', () => {
    const result = bucketByTimeOfDay([]);
    expect(result).toHaveLength(4);
    result.forEach((bucket) => expect(bucket.count).toBe(0));
  });

  it('sorts dates into correct time buckets', () => {
    const dates = [
      new Date('2024-01-15T06:00:00Z'), // morning (5-12)
      new Date('2024-01-15T09:00:00Z'), // morning
      new Date('2024-01-15T14:00:00Z'), // afternoon (12-17)
      new Date('2024-01-15T19:00:00Z'), // evening (17-22)
      new Date('2024-01-15T23:00:00Z'), // late night (22+)
      new Date('2024-01-15T02:00:00Z'), // late night (<5)
    ];
    const result = bucketByTimeOfDay(dates);
    expect(result[0]!.count).toBe(2); // morning
    expect(result[1]!.count).toBe(1); // afternoon
    expect(result[2]!.count).toBe(1); // evening
    expect(result[3]!.count).toBe(2); // late night
  });
});
