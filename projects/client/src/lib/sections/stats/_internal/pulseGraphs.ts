import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { toHumanDayOfWeek } from '$lib/utils/formatting/date/toHumanDayOfWeek.ts';

export const daysInWeek = 7;
const trendWeekCount = 4;
const morningStartHour = 5;
const afternoonStartHour = 12;
const eveningStartHour = 17;
const lateNightStartHour = 22;

const minActiveDaysForDaily = 3;
const weekTrendVarianceThreshold = 0.25;
const clockPeakThreshold = 0.4;
const minRatingsForDistribution = 5;
const minDistinctScores = 3;

export type PulseGraphType =
  | 'dailyBars'
  | 'weekTrend'
  | 'watchClock'
  | 'showsMovies'
  | 'ratingsDistribution';

export type PulseGraphData = {
  readonly dailyBars: {
    readonly days: readonly number[];
    readonly labels: readonly string[];
  };
  readonly weekTrend: {
    readonly weeks: ReadonlyArray<
      { readonly label: string; readonly plays: number }
    >;
  };
  readonly watchClock: {
    readonly buckets: ReadonlyArray<
      { readonly label: string; readonly count: number }
    >;
  };
  readonly showsMovies: {
    readonly episodes: number;
    readonly movies: number;
  };
  readonly ratingsDistribution: {
    readonly buckets: readonly number[];
    readonly average: number;
  };
};

export function countByCalendarDay(
  { dates, now, locale }: {
    dates: ReadonlyArray<Date>;
    now: Date;
    locale: AvailableLocale;
  },
): { readonly days: readonly number[]; readonly labels: readonly string[] } {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayRange = Array.from({ length: daysInWeek }, (_, idx) => {
    const offset = daysInWeek - 1 - idx;
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - offset,
    );
  });

  const days = dayRange.map((day) => {
    const key = getDayKey(day);
    return dates.filter((d) => getDayKey(d) === key).length;
  });

  const labels = dayRange.map((day, idx) =>
    idx === daysInWeek - 1
      ? m.text_stats_today()
      : toHumanDayOfWeek(day, locale)
  );

  return { days, labels };
}

function timeBucketIndex(hour: number): number {
  if (hour >= morningStartHour && hour < afternoonStartHour) return 0;
  if (hour >= afternoonStartHour && hour < eveningStartHour) return 1;
  if (hour >= eveningStartHour && hour < lateNightStartHour) return 2;
  return 3;
}

export function bucketByTimeOfDay(
  dates: ReadonlyArray<Date>,
): ReadonlyArray<{ readonly label: string; readonly count: number }> {
  const counts = Array.from(
    { length: 4 },
    (_, i) => dates.filter((d) => timeBucketIndex(d.getHours()) === i).length,
  );

  return [
    { label: m.text_stats_time_morning(), count: counts[0] ?? 0 },
    { label: m.text_stats_time_afternoon(), count: counts[1] ?? 0 },
    { label: m.text_stats_time_evening(), count: counts[2] ?? 0 },
    { label: m.text_stats_time_late_night(), count: counts[3] ?? 0 },
  ];
}

export function computeWeekTrend(
  dates: ReadonlyArray<Date>,
  now: Date,
): ReadonlyArray<{ readonly label: string; readonly plays: number }> {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const labels = [
    m.text_stats_weeks_ago({ count: '4' }),
    m.text_stats_weeks_short({ count: '3' }),
    m.text_stats_weeks_short({ count: '2' }),
    m.text_stats_this_week(),
  ];

  return Array.from({ length: trendWeekCount }, (_, idx) => {
    const i = trendWeekCount - 1 - idx;
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (i * daysInWeek + daysInWeek - 1),
    );
    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (i * daysInWeek) + 1,
    );
    const count = dates.filter((d) => d >= start && d < end).length;
    return { label: labels[idx] ?? '', plays: count };
  });
}

export function computeRatingsDistribution(
  scores: ReadonlyArray<number>,
): { readonly buckets: readonly number[]; readonly average: number } {
  const valid = scores.filter((s) => s >= 1 && s <= 10);
  const buckets = Array.from(
    { length: 10 },
    (_, i) => valid.filter((s) => s === i + 1).length,
  );
  const average = valid.length > 0
    ? valid.reduce((sum, s) => sum + s, 0) / valid.length
    : 0;

  return { buckets, average };
}

export const graphScoreMax = 10;

export function pickGraphs(
  graphData: PulseGraphData,
): ReadonlyArray<{ type: PulseGraphType; score: number }> {
  type Candidate = { type: PulseGraphType; score: number };
  const candidates: Candidate[] = [];

  const activeDays = graphData.dailyBars.days.filter((c) => c > 0).length;
  if (activeDays >= minActiveDaysForDaily) {
    candidates.push({ type: 'dailyBars', score: activeDays });
  }

  const weekPlays = graphData.weekTrend.weeks.map((w) => w.plays);
  const maxWeek = Math.max(...weekPlays);
  const minWeek = Math.min(...weekPlays);
  if (
    maxWeek > 0 && (maxWeek - minWeek) / maxWeek > weekTrendVarianceThreshold
  ) {
    candidates.push({
      type: 'weekTrend',
      score: ((maxWeek - minWeek) / maxWeek) * 10,
    });
  }

  const clockTotal = graphData.watchClock.buckets.reduce(
    (s, b) => s + b.count,
    0,
  );
  const clockPeak = Math.max(
    ...graphData.watchClock.buckets.map((b) => b.count),
  );
  if (clockTotal > 0 && clockPeak / clockTotal > clockPeakThreshold) {
    candidates.push({
      type: 'watchClock',
      score: (clockPeak / clockTotal) * 10,
    });
  }

  const { episodes, movies: movieCount } = graphData.showsMovies;
  if (episodes > 0 && movieCount > 0) {
    const balance = Math.min(episodes, movieCount) /
      Math.max(episodes, movieCount);
    candidates.push({ type: 'showsMovies', score: balance * 10 });
  }

  const ratingsBuckets = graphData.ratingsDistribution.buckets;
  const totalRatings = ratingsBuckets.reduce((s, c) => s + c, 0);
  const distinctScores = ratingsBuckets.filter((c) => c > 0).length;

  if (
    totalRatings >= minRatingsForDistribution &&
    distinctScores >= minDistinctScores
  ) {
    const nonZero = ratingsBuckets.filter((c) => c > 0);
    const mean = nonZero.reduce((s, c) => s + c, 0) / nonZero.length;
    const variance = nonZero.reduce((s, c) => s + (c - mean) ** 2, 0) /
      nonZero.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
    candidates.push({
      type: 'ratingsDistribution',
      score: Math.min(cv * 10, 10),
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}
