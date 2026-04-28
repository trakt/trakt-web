import type { EpisodeActivityHistory } from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { getStartOfDay } from '$lib/utils/date/getStartOfDay.ts';
import { subtractDays } from '$lib/utils/date/subtractDays.ts';

export type ActivityEntry = MovieActivityHistory | EpisodeActivityHistory;

const daysInWeek = 7;

function getRuntimeMinutes(entry: ActivityEntry): number {
  return entry.type === 'movie' ? entry.movie.runtime : entry.episode.runtime;
}

export function computeTotalMinutes(
  entries: ReadonlyArray<ActivityEntry>,
): number {
  return entries.reduce((sum, e) => sum + getRuntimeMinutes(e), 0);
}

export function computeDailyMinutes(
  entries: ReadonlyArray<ActivityEntry>,
  now: Date,
): ReadonlyArray<number> {
  const today = getStartOfDay(now);
  const days = Array.from(
    { length: daysInWeek },
    (_, i) => subtractDays(today, daysInWeek - 1 - i),
  );

  return days.map((day) => {
    const key = getDayKey(day);
    return entries
      .filter((e) => getDayKey(e.watchedAt) === key)
      .reduce((sum, e) => sum + getRuntimeMinutes(e), 0);
  });
}
