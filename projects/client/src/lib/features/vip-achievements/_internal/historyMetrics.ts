import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';

// Cohesive module of pure watch-history metric extractors. Each degrades to `0`
// / empty when history is absent (it loads as `null`). Days and hours are the
// member's own: a watch at 00:30 in Barcelona counts towards that calendar day
// and that hour, not UTC's.

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const NIGHT_END_HOUR = 4;

const toLocalTime = (date: Date): number =>
  date.getTime() - date.getTimezoneOffset() * 60_000;

const dayIndex = (date: Date): number => Math.floor(toLocalTime(date) / DAY_MS);

const localHour = (date: Date): number =>
  Math.floor((toLocalTime(date) - dayIndex(date) * DAY_MS) / HOUR_MS);

/** Every watch timestamp across movies and show episodes. */
export function collectWatchTimestamps(history: UserHistory | Nil): Date[] {
  if (!history) {
    return [];
  }

  const dates: Date[] = [];
  for (const movie of history.movies.values()) {
    dates.push(...movie.watchedDates);
  }
  for (const show of history.shows.values()) {
    dates.push(...show.watchedDates);
  }
  return dates;
}

/** Longest run of consecutive days with at least one watch (monotonic). */
export function computeLongestStreak(history: UserHistory | Nil): number {
  const days = [...new Set(collectWatchTimestamps(history).map(dayIndex))]
    .toSorted((a, b) => a - b);

  return days.reduce(
    (acc, day, index) => {
      const previous = days.at(index - 1);
      const current =
        index > 0 && previous !== undefined && day === previous + 1
          ? acc.current + 1
          : 1;
      return { current, longest: Math.max(acc.longest, current) };
    },
    { current: 0, longest: 0 },
  ).longest;
}

/** Plays logged between midnight and 04:00, local time. */
export function countNightOwlPlays(history: UserHistory | Nil): number {
  return collectWatchTimestamps(history).filter((date) =>
    localHour(date) < NIGHT_END_HOUR
  ).length;
}

/** Days on which 2+ distinct movies were watched. */
export function countDoubleFeatures(history: UserHistory | Nil): number {
  if (!history) {
    return 0;
  }

  const moviesByDay = new Map<number, Set<number>>();
  for (const movie of history.movies.values()) {
    for (const date of movie.watchedDates) {
      const key = dayIndex(date);
      const set = moviesByDay.get(key) ?? new Set<number>();
      set.add(movie.id);
      moviesByDay.set(key, set);
    }
  }

  return [...moviesByDay.values()].filter((set) => set.size >= 2).length;
}

/** Show/day pairs with 8+ episodes watched (a "season in a day"). */
export function countMarathonDays(history: UserHistory | Nil): number {
  if (!history) {
    return 0;
  }

  const episodesByShowDay = new Map<string, number>();
  for (const show of history.shows.values()) {
    for (const episode of show.episodes) {
      const key = `${show.id}:${dayIndex(episode.watchedAt)}`;
      episodesByShowDay.set(key, (episodesByShowDay.get(key) ?? 0) + 1);
    }
  }

  return [...episodesByShowDay.values()].filter((count) => count >= 8).length;
}
