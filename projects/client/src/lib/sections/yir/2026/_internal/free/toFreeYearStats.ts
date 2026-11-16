import type { UserFavorites } from '$lib/features/auth/queries/currentUserFavoritesQuery.ts';
import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { differenceInCalendarDays } from 'date-fns/differenceInCalendarDays';
import { startOfDay } from 'date-fns/startOfDay';

type ToFreeYearStatsParams = {
  history: UserHistory;
  ratings: UserRatings | Nil;
  favorites: UserFavorites | Nil;
  year: number;
};

type Streak = {
  days: number;
  start: Date;
  end: Date;
};

type FreeYearStats = {
  monthPlays: ReadonlyArray<number>;
  weekdayPlays: ReadonlyArray<number>;
  streak: Streak | null;
  firstPlay: Date | null;
  ratings: {
    count: number;
    average: number;
    distribution: ReadonlyArray<number>;
  };
  favorites: number;
};

const MONTHS = 12;
const WEEKDAYS = 7;
const RATING_STEPS = 10;

const countBy = (size: number, indexes: ReadonlyArray<number>) =>
  Array.from(
    { length: size },
    (_, slot) => indexes.filter((index) => index === slot).length,
  );

function toLongestStreak(dates: ReadonlyArray<Date>): Streak | null {
  const days = [
    ...new Map(
      dates.map((date) => {
        const day = startOfDay(date);
        return [day.getTime(), day];
      }),
    ).values(),
  ].toSorted((a, b) => a.getTime() - b.getTime());

  const first = days.at(0);
  if (!first) return null;

  const runs = days.slice(1).reduce(
    (acc, day, index) => {
      const previous = days.at(index) ?? day;
      const current = acc.at(-1) ?? { days: 1, start: first, end: first };
      return differenceInCalendarDays(day, previous) === 1
        ? [
            ...acc.slice(0, -1),
            { ...current, days: current.days + 1, end: day },
          ]
        : [...acc, { days: 1, start: day, end: day }];
    },
    [{ days: 1, start: first, end: first }],
  );

  return runs.reduce((best, run) => (run.days > best.days ? run : best));
}

export function toFreeYearStats({
  history,
  ratings,
  favorites,
  year,
}: ToFreeYearStatsParams): FreeYearStats {
  const inYear = (date: Date) => date.getFullYear() === year;

  const plays = [...history.movies.values(), ...history.shows.values()]
    .flatMap(({ watchedDates }) => watchedDates)
    .filter(inYear);

  const rated = ratings
    ? [
        ...ratings.movies.values(),
        ...ratings.shows.values(),
        ...ratings.seasons.values(),
        ...ratings.episodes.values(),
      ].filter(({ ratedAt }) => inYear(ratedAt))
    : [];

  const favorited = favorites
    ? [...favorites.movies.values(), ...favorites.shows.values()].filter(
        ({ favoritedAt }) => inYear(favoritedAt),
      )
    : [];

  return {
    monthPlays: countBy(
      MONTHS,
      plays.map((date) => date.getMonth()),
    ),
    weekdayPlays: countBy(
      WEEKDAYS,
      plays.map((date) => date.getDay()),
    ),
    streak: toLongestStreak(plays),
    firstPlay: plays.reduce<Date | null>(
      (first, date) => (first && first <= date ? first : date),
      null,
    ),
    ratings: {
      count: rated.length,
      average:
        rated.length === 0
          ? 0
          : rated.reduce((total, { rating }) => total + rating, 0) /
            rated.length,
      distribution: countBy(
        RATING_STEPS,
        rated.map(({ rating }) => rating - 1),
      ),
    },
    favorites: favorited.length,
  };
}
