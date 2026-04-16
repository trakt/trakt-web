import { getDayKey } from '$lib/utils/date/getDayKey.ts';

export type MonthlyStats = {
  readonly currentStreak: number;
  readonly previousStreak: number;
  readonly droppedStreaksThisMonth: number;
  readonly activeDaysThisMonth: number;
  readonly totalElapsedDaysThisMonth: number;
  readonly activeDaysThisYear: number;
};

type StreakSegment = {
  readonly end: Date;
  readonly length: number;
};

function toMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function areConsecutiveDays(dateA: Date, dateB: Date): boolean {
  const nextDay = new Date(
    dateA.getFullYear(),
    dateA.getMonth(),
    dateA.getDate() + 1,
  );
  return nextDay.getTime() === dateB.getTime();
}

function deduplicateAndSort(
  dates: ReadonlyArray<Date>,
): ReadonlyArray<Date> {
  const uniqueByDay = new Map(
    dates.map((date) => {
      const normalized = toMidnight(date);
      return [getDayKey(normalized), normalized];
    }),
  );
  return [...uniqueByDay.values()].sort(
    (a, b) => a.getTime() - b.getTime(),
  );
}

function buildStreakSegments(
  sortedDays: ReadonlyArray<Date>,
): ReadonlyArray<StreakSegment> {
  if (sortedDays.length === 0) return [];

  const [first, ...rest] = sortedDays;

  if (!first) return [];

  return rest.reduce<ReadonlyArray<StreakSegment>>(
    (segments, day, index) => {
      const previousDay = sortedDays[index];
      const lastSegment = segments.at(-1);

      if (
        !previousDay || !lastSegment || !areConsecutiveDays(previousDay, day)
      ) {
        return [...segments, { end: day, length: 1 }];
      }

      return [
        ...segments.slice(0, -1),
        { end: day, length: lastSegment.length + 1 },
      ];
    },
    [{ end: first, length: 1 }],
  );
}

export function computeMonthlyStats(
  watchedDates: ReadonlyArray<Date>,
  now: Date,
): MonthlyStats {
  const today = toMidnight(now);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthStart = new Date(currentYear, currentMonth, 1);
  const yesterday = new Date(currentYear, currentMonth, today.getDate() - 1);

  const sortedDays = deduplicateAndSort(watchedDates);
  const totalElapsedDaysThisMonth = today.getDate();

  const activeDaysThisMonth = sortedDays
    .filter((d) =>
      d.getMonth() === currentMonth && d.getFullYear() === currentYear
    ).length;

  const activeDaysThisYear = sortedDays
    .filter((d) => d.getFullYear() === currentYear).length;

  const segments = buildStreakSegments(sortedDays);

  const activeSegmentIndex = segments.findIndex(
    (segment) =>
      segment.end.getTime() === today.getTime() ||
      segment.end.getTime() === yesterday.getTime(),
  );

  const currentStreak = activeSegmentIndex >= 0
    ? segments[activeSegmentIndex]?.length ?? 0
    : 0;

  const previousStreak = activeSegmentIndex > 0
    ? segments[activeSegmentIndex - 1]?.length ?? 0
    : 0;

  const droppedStreaksThisMonth = segments.filter((segment, index) => {
    if (index === activeSegmentIndex) return false;
    return segment.end >= monthStart && segment.end < today;
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
