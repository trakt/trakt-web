import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';

// Cohesive module of pure watch-history metric extractors. Each degrades to `0`
// / empty when history is absent (it loads as `null`). Days and hours are the
// member's own: a watch at 00:30 in Barcelona counts towards that calendar day
// and that hour, not UTC's.

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const NIGHT_END_HOUR = 4;
const EARLY_BIRD_HOURS = { from: 5, until: 8 } as const;
const LONG_HAUL_EPISODES = 100;
// 1 January 1970 was a Thursday: shifting by three days starts weeks on Monday.
const WEEK_START_OFFSET = 3;

const toLocalTime = (date: Date): number =>
  date.getTime() - date.getTimezoneOffset() * 60_000;

const dayIndex = (date: Date): number => Math.floor(toLocalTime(date) / DAY_MS);

const localHour = (date: Date): number =>
  Math.floor((toLocalTime(date) - dayIndex(date) * DAY_MS) / HOUR_MS);

const weekIndex = (date: Date): number =>
  Math.floor((dayIndex(date) + WEEK_START_OFFSET) / 7);

// The local calendar date, read back with the UTC getters.
const localDate = (date: Date): Date => new Date(toLocalTime(date));

const longestRun = (indices: ReadonlyArray<number>): number => {
  const sorted = [...new Set(indices)].toSorted((a, b) => a - b);

  return sorted.reduce(
    (acc, index, position) => {
      const previous = sorted.at(position - 1);
      const current =
        position > 0 && previous !== undefined && index === previous + 1
          ? acc.current + 1
          : 1;
      return { current, longest: Math.max(acc.longest, current) };
    },
    { current: 0, longest: 0 },
  ).longest;
};

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
  return longestRun(collectWatchTimestamps(history).map(dayIndex));
}

/** Longest run of consecutive Monday-to-Sunday weeks with at least one watch. */
export function computeLongestWeeklyRun(history: UserHistory | Nil): number {
  return longestRun(collectWatchTimestamps(history).map(weekIndex));
}

/** Distinct calendar days on which anything was watched. */
export function countActiveDays(history: UserHistory | Nil): number {
  return new Set(collectWatchTimestamps(history).map(dayIndex)).size;
}

/** Plays logged between midnight and 04:00, local time. */
export function countNightOwlPlays(history: UserHistory | Nil): number {
  return collectWatchTimestamps(history).filter(
    (date) => localHour(date) < NIGHT_END_HOUR,
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

/** Plays logged between 05:00 and 08:00, local time. */
export function countEarlyBirdPlays(history: UserHistory | Nil): number {
  return collectWatchTimestamps(history).filter((date) => {
    const hour = localHour(date);
    return hour >= EARLY_BIRD_HOURS.from && hour < EARLY_BIRD_HOURS.until;
  }).length;
}

/** Shows with at least 100 different episodes watched. */
export function countLongHaulShows(history: UserHistory | Nil): number {
  if (!history) {
    return 0;
  }

  return [...history.shows.values()].filter(
    (show) => show.episodes.length >= LONG_HAUL_EPISODES,
  ).length;
}

/** Plays logged in the hour either side of New Year's midnight, local time. */
export function countNewYearPlays(history: UserHistory | Nil): number {
  return collectWatchTimestamps(history).filter((date) => {
    const local = localDate(date);
    const month = local.getUTCMonth();
    const day = local.getUTCDate();
    const hour = local.getUTCHours();
    return (
      (month === 11 && day === 31 && hour === 23) ||
      (month === 0 && day === 1 && hour === 0)
    );
  }).length;
}

/** Plays logged on 29 February, local time. */
export function countLeapDayPlays(history: UserHistory | Nil): number {
  return collectWatchTimestamps(history).filter((date) => {
    const local = localDate(date);
    return local.getUTCMonth() === 1 && local.getUTCDate() === 29;
  }).length;
}

/** Movies watched more than once on the same local day. */
export function countSameDayMovieRewatches(history: UserHistory | Nil): number {
  if (!history) {
    return 0;
  }

  return [...history.movies.values()].filter((movie) => {
    const days = movie.watchedDates.map(dayIndex);
    return new Set(days).size < days.length;
  }).length;
}
