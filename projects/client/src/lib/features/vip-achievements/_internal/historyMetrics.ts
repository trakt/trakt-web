import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';

// Cohesive module of pure watch-history metric extractors. Each degrades to `0`
// / empty when history is absent (it loads as `null`). Day bucketing uses UTC
// day indices so results are deterministic regardless of runtime timezone.

const DAY_MS = 86_400_000;

const dayIndex = (date: Date): number => Math.floor(date.getTime() / DAY_MS);

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

/** Distinct calendar days on which anything was watched. */
export function countActiveDays(history: UserHistory | Nil): number {
  return new Set(collectWatchTimestamps(history).map(dayIndex)).size;
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

/** Plays logged between 01:00 and 04:00. */
export function countNightOwlPlays(history: UserHistory | Nil): number {
  return collectWatchTimestamps(history).filter((date) => {
    const hour = date.getUTCHours();
    return hour >= 1 && hour < 4;
  }).length;
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
