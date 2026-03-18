import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import type { ShowActivityHistory } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';

export type PulseStat = {
  readonly key: string;
  readonly value: string;
  readonly label: string;
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

export function dedup(
  candidates: ReadonlyArray<PulseStat>,
  rawCounts: ReadonlyMap<string, number>,
): readonly PulseStat[] {
  const playsRaw = rawCounts.get('totalPlays') ?? 0;
  const episodesRaw = rawCounts.get('episodes') ?? 0;
  const moviesRaw = rawCounts.get('movies') ?? 0;

  return candidates.filter((c) => {
    if (c.key === 'episodes' && playsRaw === episodesRaw && playsRaw > 0) {
      return false;
    }
    if (c.key === 'movies' && playsRaw === moviesRaw && playsRaw > 0) {
      return false;
    }
    return !(c.key === 'movies' && moviesRaw === 0 && c.delta === 0);
  });
}
