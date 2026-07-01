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
    const result = bucketByTimeOfDay({ movieDates: [], showDates: [] });
    expect(result).toHaveLength(4);
    result.forEach((bucket) => {
      expect(bucket.count).toBe(0);
      expect(bucket.movies).toBe(0);
      expect(bucket.episodes).toBe(0);
    });
  });

  it('sorts movies and episodes into their time buckets and totals them', () => {
    const movieDates = [
      new Date('2024-01-15T06:00:00'), // morning (5-12)
      new Date('2024-01-15T09:00:00'), // morning
      new Date('2024-01-15T14:00:00'), // afternoon (12-17)
    ];
    const showDates = [
      new Date('2024-01-15T19:00:00'), // evening (17-22)
      new Date('2024-01-15T23:00:00'), // late night (22+)
      new Date('2024-01-15T02:00:00'), // late night (<5)
    ];

    const result = bucketByTimeOfDay({ movieDates, showDates });

    expect(result[0]!).toMatchObject({ movies: 2, episodes: 0, count: 2 }); // morning
    expect(result[1]!).toMatchObject({ movies: 1, episodes: 0, count: 1 }); // afternoon
    expect(result[2]!).toMatchObject({ movies: 0, episodes: 1, count: 1 }); // evening
    expect(result[3]!).toMatchObject({ movies: 0, episodes: 2, count: 2 }); // late night
  });
});
