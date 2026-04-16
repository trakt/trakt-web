import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { computeStreak } from './../useStreak.ts';

export type MonthlyStats = {
  readonly currentStreak: number;
  readonly previousStreak: number;
  readonly droppedStreaksThisMonth: number;
  readonly activeDaysThisMonth: number;
  readonly totalElapsedDaysThisMonth: number;
  readonly activeDaysThisYear: number;
};

type StreakSegment = {
  readonly end: string;
  readonly length: number;
};

function parseDayKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year!, month! - 1, day!);
}

function areConsecutiveDays(dayKeyA: string, dayKeyB: string): boolean {
  const dateA = parseDayKey(dayKeyA);
  const nextDay = new Date(
    dateA.getFullYear(),
    dateA.getMonth(),
    dateA.getDate() + 1,
  );
  return getDayKey(parseDayKey(dayKeyB)) === getDayKey(nextDay);
}

function buildStreakSegments(
  sortedDayKeys: ReadonlyArray<string>,
): ReadonlyArray<StreakSegment> {
  if (sortedDayKeys.length === 0) return [];

  const [first, ...rest] = sortedDayKeys;

  return rest.reduce<ReadonlyArray<StreakSegment>>(
    (segments, key, index) => {
      const previousKey = sortedDayKeys[index]!;
      const lastSegment = segments.at(-1)!;

      if (!areConsecutiveDays(previousKey, key)) {
        return [...segments, { end: key, length: 1 }];
      }

      return [
        ...segments.slice(0, -1),
        { end: key, length: lastSegment.length + 1 },
      ];
    },
    [{ end: first!, length: 1 }],
  );
}

export function computeMonthlyStats(
  watchedDates: ReadonlyArray<Date>,
  now: Date,
): MonthlyStats {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthStart = new Date(currentYear, currentMonth, 1);

  const daysWithActivity = new Set(watchedDates.map(getDayKey));
  const sortedDayKeys = [...daysWithActivity].sort(
    (a, b) => parseDayKey(a).getTime() - parseDayKey(b).getTime(),
  );

  const { count: currentStreak } = computeStreak(watchedDates, now);
  const totalElapsedDaysThisMonth = today.getDate();

  const activeDaysThisMonth = sortedDayKeys
    .filter((key) => {
      const d = parseDayKey(key);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

  const activeDaysThisYear = sortedDayKeys
    .filter((key) => parseDayKey(key).getFullYear() === currentYear).length;

  const segments = buildStreakSegments(sortedDayKeys);

  const todayKey = getDayKey(today);
  const yesterdayKey = getDayKey(
    new Date(currentYear, currentMonth, today.getDate() - 1),
  );

  const activeSegmentIndex = segments.findIndex(
    (segment) => segment.end === todayKey || segment.end === yesterdayKey,
  );

  const previousStreak = activeSegmentIndex > 0
    ? segments[activeSegmentIndex - 1]!.length
    : 0;

  const droppedStreaksThisMonth = segments.filter((segment, index) => {
    if (index === activeSegmentIndex) return false;
    const endDate = parseDayKey(segment.end);
    return endDate >= monthStart && endDate < today;
  }).length;

  return {
    currentStreak,
    previousStreak,
    droppedStreaksThisMonth,
    activeDaysThisMonth,
    totalElapsedDaysThisMonth,
    activeDaysThisYear,
  };
}
