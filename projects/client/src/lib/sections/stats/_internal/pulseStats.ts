import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import type { ShowActivityHistory } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';

export type PulseStat = {
  readonly key: string;
  readonly value: string;
  readonly label: string;
  readonly tooltip?: string;
  readonly delta: number | null;
  readonly note?: string;
};

export function sumHours(
  movieEntries: ReadonlyArray<MovieActivityHistory>,
  showEntries: ReadonlyArray<ShowActivityHistory>,
): number {
  const movieMinutes = movieEntries.reduce(
    (sum, m) => sum + m.movie.runtime,
    0,
  );
  const showMinutes = showEntries.reduce(
    (sum, s) => sum + s.episode.runtime,
    0,
  );
  return Math.round((movieMinutes + showMinutes) / 60);
}

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

/**
 * Hard redundancy filter — removes stats that duplicate information.
 * When all plays are one type, keep the specific type and drop the generic.
 */
function filterRedundant(
  candidates: ReadonlyArray<PulseStat>,
  rawCounts: ReadonlyMap<string, number>,
): readonly PulseStat[] {
  const plays = rawCounts.get('totalPlays') ?? 0;
  const episodes = rawCounts.get('episodes') ?? 0;
  const movies = rawCounts.get('movies') ?? 0;

  return candidates.filter((c) => {
    // All plays are episodes → drop totalPlays (keep the more specific "Episodes")
    if (c.key === 'totalPlays' && plays === episodes && plays > 0) return false;
    // All plays are movies → drop totalPlays (keep the more specific "Movies")
    if (c.key === 'totalPlays' && plays === movies && plays > 0) return false;
    // Zero movies with no change → not interesting
    if (c.key === 'movies' && movies === 0 && c.delta === 0) return false;
    // Zero episodes with no change → not interesting
    return !(c.key === 'episodes' && episodes === 0 && c.delta === 0);
  });
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

function infoScore(numValue: number, delta: number | null, note?: string): number {
  if (numValue === 0 && (delta ?? 0) === 0) return 0;
  return note ? 7 : 5;
}

function scoreStat(stat: PulseStat): number {
  const numValue = Number(stat.value.replace(/,/g, '')) || 0;

  return (
    deltaScore(stat.delta, numValue) * scoreWeights.delta +
    richnessScore(numValue, stat.delta) * scoreWeights.richness +
    infoScore(numValue, stat.delta, stat.note) * scoreWeights.info
  );
}

/**
 * Rank stats by relevance: filter redundant, score, sort descending.
 */
export function rankStats(
  candidates: ReadonlyArray<PulseStat>,
  rawCounts: ReadonlyMap<string, number>,
): readonly PulseStat[] {
  const filtered = filterRedundant(candidates, rawCounts);
  return [...filtered].sort((a, b) => scoreStat(b) - scoreStat(a));
}
