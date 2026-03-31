import { getDayKey } from '$lib/utils/date/getDayKey.ts';

export type PulseStat = {
  readonly key: string;
  readonly value: string;
  readonly label: string;
  readonly tooltip?: string;
  readonly delta: number | null;
  readonly note?: string;
};

export function countUniqueDays(dates: ReadonlyArray<Date>): number {
  return new Set(dates.map(getDayKey)).size;
}

export function getBusiestDay(
  dates: ReadonlyArray<Date>,
): { readonly dayIndex: number; readonly count: number } | null {
  if (dates.length === 0) return null;

  const counts = dates.reduce((acc, d) => {
    const dow = d.getDay();
    acc.set(dow, (acc.get(dow) ?? 0) + 1);
    return acc;
  }, new Map<number, number>());

  return [...counts.entries()].reduce(
    (best, [day, count]) =>
      count > best.count ? { dayIndex: day, count } : best,
    { dayIndex: 0, count: 0 },
  );
}

export function dayOfWeekDate(dayIndex: number, now: Date): Date {
  const date = new Date(now);
  date.setDate(date.getDate() - ((date.getDay() - dayIndex + 7) % 7));
  return date;
}

export function maxPlaysInSingleDay(dates: ReadonlyArray<Date>): number {
  if (dates.length === 0) return 0;

  const counts = dates.reduce((acc, d) => {
    const key = getDayKey(d);
    acc.set(key, (acc.get(key) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());

  return Math.max(...counts.values());
}

export function computeDelta(thisWeek: number, lastWeek: number): number {
  return thisWeek - lastWeek;
}

const scoreWeights = {
  delta: 4,
  richness: 3,
  info: 3,
} as const;

function deltaScore(delta: number | null, numValue: number): number {
  if (delta == null) return 3;
  const absDelta = Math.abs(delta);
  if (absDelta === 0) return 0;
  return Math.max(Math.min((absDelta / Math.max(numValue, 1)) * 10, 10), 2);
}

function richnessScore(numValue: number, delta: number | null): number {
  if (numValue > 0) return Math.min(numValue, 10);
  if (delta != null && delta !== 0) return 2;
  return 0;
}

function infoScore(
  numValue: number,
  delta: number | null,
  note?: string,
): number {
  if (numValue === 0 && (delta ?? 0) === 0) return 0;
  return note ? 7 : 5;
}

// (10 * 4) + (10 * 3) + (7 * 3) = 130
export const statScoreMax = 130;

function scoreStat(stat: PulseStat): number {
  const numValue = Number(stat.value.replace(/,/g, '')) || 0;

  return (
    deltaScore(stat.delta, numValue) * scoreWeights.delta +
    richnessScore(numValue, stat.delta) * scoreWeights.richness +
    infoScore(numValue, stat.delta, stat.note) * scoreWeights.info
  );
}

const redundancyPenalty = 0.01;

function isRedundant(
  stat: PulseStat,
  rawCounts: ReadonlyMap<string, number>,
): boolean {
  const plays = rawCounts.get('totalPlays') ?? 0;
  const episodes = rawCounts.get('episodes') ?? 0;
  const movies = rawCounts.get('movies') ?? 0;

  return (
    (stat.key === 'totalPlays' && plays > 0 &&
      (plays === episodes || plays === movies)) ||
    (stat.key === 'movies' && movies === 0 && stat.delta === 0) ||
    (stat.key === 'episodes' && episodes === 0 && stat.delta === 0)
  );
}

export function scoreStatWithContext(
  stat: PulseStat,
  rawCounts: ReadonlyMap<string, number>,
): number {
  const base = scoreStat(stat);
  return isRedundant(stat, rawCounts) ? base * redundancyPenalty : base;
}

export function rankStats(
  candidates: ReadonlyArray<PulseStat>,
  rawCounts: ReadonlyMap<string, number>,
): readonly PulseStat[] {
  return [...candidates].sort(
    (a, b) =>
      scoreStatWithContext(b, rawCounts) - scoreStatWithContext(a, rawCounts),
  );
}
