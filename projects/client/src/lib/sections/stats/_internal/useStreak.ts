import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { map } from 'rxjs';
import { filterWatchedDates } from './filterWatchedDates.ts';
import { getAttributedStreakDay } from './utils/getAttributedStreakDay.ts';

type StreakResult = {
  readonly count: number;
};

const emptyStreak: StreakResult = {
  count: 0,
};

export function computeStreak(
  watchedDates: ReadonlyArray<Date>,
  now: Date,
): StreakResult {
  if (watchedDates.length === 0) {
    return emptyStreak;
  }

  const daysWithActivity = new Set(
    watchedDates
      .toSorted((a, b) => b.getTime() - a.getTime())
      .map((date) => getDayKey(getAttributedStreakDay(date))),
  );

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const yesterday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );

  const hasActivityToday = daysWithActivity.has(getDayKey(today));
  const hasActivityYesterday = daysWithActivity.has(getDayKey(yesterday));

  if (!hasActivityToday && !hasActivityYesterday) {
    return emptyStreak;
  }

  const startDate = hasActivityToday ? today : yesterday;

  const sortedDays = [...daysWithActivity];
  const previousDays = sortedDays.slice(
    sortedDays.indexOf(getDayKey(startDate)),
  );

  const breakIndex = previousDays.findIndex((day, i) => {
    const expected = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() - i,
    );
    return day !== getDayKey(expected);
  });

  const streakCount = breakIndex === -1 ? previousDays.length : breakIndex;

  return {
    count: streakCount,
  };
}

export function useStreak({ mode }: { mode: DiscoverMode }) {
  const { history } = useUser();

  const now = new Date();

  const streak = history.pipe(
    map(($history) => {
      if (!$history) return null;

      const watchedDates = filterWatchedDates($history, mode);

      return computeStreak(watchedDates, now);
    }),
    multicast(),
  );

  return {
    streakCount: streak.pipe(map(($s) => $s?.count ?? 0)),
    isLoading: streak.pipe(map(($s) => $s === null)),
  };
}
