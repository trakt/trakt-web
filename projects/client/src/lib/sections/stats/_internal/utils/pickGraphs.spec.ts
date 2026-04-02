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

import type { PulseGraphData } from '../models/PulseGraphData.ts';
import { computeRatingsDistribution } from './computeRatingsDistribution.ts';
import { pickGraphs } from './pickGraphs.ts';

const emptyGraphData: PulseGraphData = {
  dailyBars: { days: [0, 0, 0, 0, 0, 0, 0], labels: [] },
  weekTrend: {
    weeks: Array.from({ length: 4 }, () => ({ label: '', plays: 0 })),
  },
  watchClock: {
    buckets: Array.from({ length: 4 }, () => ({ label: '', count: 0 })),
  },
  showsMovies: { episodes: 0, movies: 0 },
  ratingsDistribution: {
    buckets: Array.from({ length: 10 }, () => 0),
    average: 0,
  },
};

describe('pickGraphs selection', () => {
  it('returns empty when no graph qualifies', () => {
    expect(pickGraphs(emptyGraphData)).toEqual([]);
  });

  it('includes dailyBars when enough active days', () => {
    const data: PulseGraphData = {
      ...emptyGraphData,
      dailyBars: { days: [1, 2, 0, 3, 1, 0, 2], labels: [] },
    };
    expect(pickGraphs(data).map((g) => g.type)).toContain('dailyBars');
  });

  it('includes showsMovies when both types are present', () => {
    const data: PulseGraphData = {
      ...emptyGraphData,
      showsMovies: { episodes: 5, movies: 5 },
    };
    expect(pickGraphs(data).map((g) => g.type)).toContain('showsMovies');
  });

  it('includes watchClock when a dominant time slot exists', () => {
    const data: PulseGraphData = {
      ...emptyGraphData,
      watchClock: {
        buckets: [
          { label: '', count: 0 },
          { label: '', count: 0 },
          { label: '', count: 8 },
          { label: '', count: 1 },
        ],
      },
    };
    expect(pickGraphs(data).map((g) => g.type)).toContain('watchClock');
  });

  it('does not include ratingsDistribution with < 5 ratings', () => {
    const data = {
      ...emptyGraphData,
      ratingsDistribution: computeRatingsDistribution([7, 8, 9]),
    };
    expect(pickGraphs(data).map((g) => g.type)).not.toContain(
      'ratingsDistribution',
    );
  });

  it('includes ratingsDistribution with 5+ ratings and 3+ distinct scores', () => {
    const data = {
      ...emptyGraphData,
      ratingsDistribution: computeRatingsDistribution([5, 6, 7, 8, 9]),
    };
    expect(pickGraphs(data).map((g) => g.type)).toContain(
      'ratingsDistribution',
    );
  });
});

describe('pickGraphs', () => {
  it('returns all qualifying graphs sorted by score', () => {
    const data: PulseGraphData = {
      dailyBars: { days: [3, 4, 5, 2, 1, 3, 2], labels: [] },
      weekTrend: {
        weeks: [
          { label: '', plays: 2 },
          { label: '', plays: 8 },
          { label: '', plays: 3 },
          { label: '', plays: 10 },
        ],
      },
      watchClock: {
        buckets: [
          { label: '', count: 1 },
          { label: '', count: 1 },
          { label: '', count: 8 },
          { label: '', count: 1 },
        ],
      },
      showsMovies: { episodes: 10, movies: 8 },
      ratingsDistribution: {
        buckets: Array.from({ length: 10 }, () => 0),
        average: 0,
      },
    };
    const result = pickGraphs(data);
    expect(result.length).toBeGreaterThan(1);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1]!.score).toBeGreaterThanOrEqual(result[i]!.score);
    }
  });

  it('returns empty array when no graphs qualify', () => {
    const data: PulseGraphData = {
      dailyBars: { days: [0, 0, 0, 0, 0, 0, 0], labels: [] },
      weekTrend: {
        weeks: Array.from({ length: 4 }, () => ({ label: '', plays: 0 })),
      },
      watchClock: {
        buckets: Array.from({ length: 4 }, () => ({ label: '', count: 0 })),
      },
      showsMovies: { episodes: 0, movies: 0 },
      ratingsDistribution: {
        buckets: Array.from({ length: 10 }, () => 0),
        average: 0,
      },
    };
    expect(pickGraphs(data)).toEqual([]);
  });
});
