import { describe, expect, it, vi } from 'vitest';

vi.mock('$lib/features/i18n/messages.ts', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    text_stats_today: () => 'Today',
    text_stats_time_morning: () => 'Morning',
    text_stats_time_afternoon: () => 'Afternoon',
    text_stats_time_evening: () => 'Evening',
    text_stats_time_late_night: () => 'Late Night',
    text_stats_weeks_ago: ({ count }: { count: string }) => `${count}w ago`,
    text_stats_weeks_short: ({ count }: { count: string }) => `${count}w`,
    text_stats_this_week: () => 'This week',
  };
});

import {
  bucketByTimeOfDay,
  computeRatingsDistribution,
  computeWeekTrend,
  countByCalendarDay,
  pickGraph,
  type PulseGraphData,
} from './pulseGraphs.ts';

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

describe('computeWeekTrend', () => {
  it('returns 4 weeks of data', () => {
    const now = new Date('2024-01-28T12:00:00Z');
    const result = computeWeekTrend([], now);
    expect(result).toHaveLength(4);
    result.forEach((week) => expect(week.plays).toBe(0));
  });
});

describe('computeRatingsDistribution', () => {
  it('buckets scores correctly (index 0 = score 1)', () => {
    const result = computeRatingsDistribution([1, 1, 5, 10]);
    expect(result.buckets[0]).toBe(2); // score 1
    expect(result.buckets[4]).toBe(1); // score 5
    expect(result.buckets[9]).toBe(1); // score 10
  });

  it('computes average correctly', () => {
    const result = computeRatingsDistribution([6, 8, 10]);
    expect(result.average).toBe(8);
  });

  it('handles empty input', () => {
    const result = computeRatingsDistribution([]);
    expect(result.buckets.every((b) => b === 0)).toBe(true);
    expect(result.average).toBe(0);
  });
});

describe('pickGraph', () => {
  const emptyGraphData: PulseGraphData = {
    dailyBars: { days: [0, 0, 0, 0, 0, 0, 0], labels: [] },
    weekTrend: {
      weeks: Array.from({ length: 4 }, () => ({ label: '', plays: 0 })),
    },
    watchClock: {
      buckets: Array.from({ length: 4 }, () => ({ label: '', count: 0 })),
    },
    showsMovies: { episodes: 0, movies: 0 },
    ratingsDistribution: { buckets: Array.from({ length: 10 }, () => 0), average: 0 },
  };

  it('returns null when no graph qualifies', () => {
    expect(pickGraph(emptyGraphData)).toBeNull();
  });

  it('picks dailyBars when enough active days', () => {
    const data: PulseGraphData = {
      ...emptyGraphData,
      dailyBars: { days: [1, 2, 0, 3, 1, 0, 2], labels: [] },
    };
    expect(pickGraph(data)).toBe('dailyBars');
  });

  it('picks showsMovies when both types are present and balanced', () => {
    const data: PulseGraphData = {
      ...emptyGraphData,
      showsMovies: { episodes: 5, movies: 5 },
    };
    expect(pickGraph(data)).toBe('showsMovies');
  });

  it('picks watchClock when a dominant time slot exists', () => {
    const data: PulseGraphData = {
      ...emptyGraphData,
      watchClock: {
        buckets: [
          { label: '', count: 0 },
          { label: '', count: 0 },
          { label: '', count: 8 }, // dominant evening
          { label: '', count: 1 },
        ],
      },
    };
    expect(pickGraph(data)).toBe('watchClock');
  });
});

describe('pickGraph with ratingsDistribution', () => {
  const emptyGraphData: PulseGraphData = {
    dailyBars: { days: [0, 0, 0, 0, 0, 0, 0], labels: [] },
    weekTrend: {
      weeks: Array.from({ length: 4 }, () => ({ label: '', plays: 0 })),
    },
    watchClock: {
      buckets: Array.from({ length: 4 }, () => ({ label: '', count: 0 })),
    },
    showsMovies: { episodes: 0, movies: 0 },
    ratingsDistribution: { buckets: Array.from({ length: 10 }, () => 0), average: 0 },
  };

  it('does not pick ratingsDistribution with < 5 ratings', () => {
    const data = {
      ...emptyGraphData,
      ratingsDistribution: computeRatingsDistribution([7, 8, 9]),
    };
    expect(pickGraph(data)).not.toBe('ratingsDistribution');
  });

  it('does not pick with 5+ ratings but < 3 distinct scores', () => {
    const data = {
      ...emptyGraphData,
      ratingsDistribution: computeRatingsDistribution([8, 8, 8, 8, 8]),
    };
    expect(pickGraph(data)).not.toBe('ratingsDistribution');
  });

  it('picks ratingsDistribution with 5+ ratings and 3+ distinct scores', () => {
    const data = {
      ...emptyGraphData,
      ratingsDistribution: computeRatingsDistribution([5, 6, 7, 8, 9]),
    };
    expect(pickGraph(data)).toBe('ratingsDistribution');
  });
});
