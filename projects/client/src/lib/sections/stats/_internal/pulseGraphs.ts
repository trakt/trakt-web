import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { toHumanDayOfWeek } from '$lib/utils/formatting/date/toHumanDayOfWeek.ts';

const DAYS_IN_WEEK = 7;
const TREND_WEEK_COUNT = 4;
const MORNING_START_HOUR = 5;
const AFTERNOON_START_HOUR = 12;
const EVENING_START_HOUR = 17;
const LATE_NIGHT_START_HOUR = 22;

const MIN_ACTIVE_DAYS_FOR_DAILY = 3;
const WEEK_TREND_VARIANCE_THRESHOLD = 0.25;
const CLOCK_PEAK_THRESHOLD = 0.4;

export type PulseGraphType =
  | 'dailyBars'
  | 'weekTrend'
  | 'watchClock'
  | 'showsMovies';

export type PulseGraphData = {
  readonly dailyBars: {
    readonly days: readonly number[];
    readonly labels: readonly string[];
  };
  readonly weekTrend: {
    readonly weeks: ReadonlyArray<{ readonly label: string; readonly plays: number }>;
  };
  readonly watchClock: {
    readonly buckets: ReadonlyArray<{ readonly label: string; readonly count: number }>;
  };
  readonly showsMovies: {
    readonly episodes: number;
    readonly movies: number;
  };
};

export function countByCalendarDay(
  dates: ReadonlyArray<Date>,
  now: Date,
  locale: AvailableLocale,
): { readonly days: readonly number[]; readonly labels: readonly string[] } {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayRange = Array.from({ length: DAYS_IN_WEEK }, (_, idx) => {
    const offset = DAYS_IN_WEEK - 1 - idx;
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
    idx === DAYS_IN_WEEK - 1 ? m.text_stats_today() : toHumanDayOfWeek(day, locale),
  );

  return { days, labels };
}

export function bucketByTimeOfDay(
  dates: ReadonlyArray<Date>,
): ReadonlyArray<{ readonly label: string; readonly count: number }> {
  const counts = dates.reduce(
    (acc, d) => {
      const hour = d.getHours();
      if (hour >= MORNING_START_HOUR && hour < AFTERNOON_START_HOUR) acc[0]++;
      else if (hour >= AFTERNOON_START_HOUR && hour < EVENING_START_HOUR) acc[1]++;
      else if (hour >= EVENING_START_HOUR && hour < LATE_NIGHT_START_HOUR) acc[2]++;
      else acc[3]++;
      return acc;
    },
    [0, 0, 0, 0],
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

  return Array.from({ length: TREND_WEEK_COUNT }, (_, idx) => {
    const i = TREND_WEEK_COUNT - 1 - idx;
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (i * DAYS_IN_WEEK + DAYS_IN_WEEK - 1),
    );
    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (i * DAYS_IN_WEEK) + 1,
    );
    const count = dates.filter((d) => d >= start && d < end).length;
    return { label: labels[idx] ?? '', plays: count };
  });
}

export function pickGraph(
  graphData: PulseGraphData,
): PulseGraphType | null {
  type Candidate = { type: PulseGraphType; score: number };
  const candidates: Candidate[] = [];

  const activeDays = graphData.dailyBars.days.filter((c) => c > 0).length;
  if (activeDays >= MIN_ACTIVE_DAYS_FOR_DAILY) {
    candidates.push({ type: 'dailyBars', score: activeDays });
  }

  const weekPlays = graphData.weekTrend.weeks.map((w) => w.plays);
  const maxWeek = Math.max(...weekPlays);
  const minWeek = Math.min(...weekPlays);
  if (maxWeek > 0 && (maxWeek - minWeek) / maxWeek > WEEK_TREND_VARIANCE_THRESHOLD) {
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
  if (clockTotal > 0 && clockPeak / clockTotal > CLOCK_PEAK_THRESHOLD) {
    candidates.push({
      type: 'watchClock',
      score: (clockPeak / clockTotal) * 10,
    });
  }

  const { episodes, movies: movieCount } = graphData.showsMovies;
  if (episodes > 0 && movieCount > 0) {
    const balance =
      Math.min(episodes, movieCount) / Math.max(episodes, movieCount);
    candidates.push({ type: 'showsMovies', score: balance * 10 });
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.type ?? null;
}
