import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { UserHistory } from '$lib/features/auth/queries/currentUserHistoryQuery.ts';
import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { map, shareReplay } from 'rxjs';

export type HeatmapIntensity = 0 | 1 | 2 | 3 | 4;

export type HeatmapCell = {
  readonly date: Date;
  readonly count: number;
  readonly intensity: HeatmapIntensity;
  readonly col: number; // 0–6, day of week (Sun=0)
  readonly row: number; // 0–5, week of month
  readonly isFuture: boolean;
  readonly isToday: boolean;
};

export type HeatmapData = {
  readonly cells: ReadonlyArray<HeatmapCell>;
  readonly monthLabel: string;
  readonly totalRows: number;
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

function toIntensity(count: number): HeatmapIntensity {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

export function computeActivityHeatmap(
  watchedDates: ReadonlyArray<Date>,
  now: Date,
): HeatmapData {
  const activityMap = new Map<string, number>();
  for (const date of watchedDates) {
    const key = getDayKey(date);
    activityMap.set(key, (activityMap.get(key) ?? 0) + 1);
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startCol = new Date(year, month, 1).getDay();

  const cells: HeatmapCell[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const isFuture = cellDate > today;
    const position = startCol + day - 1;
    const col = position % 7;
    const row = Math.floor(position / 7);
    const count = isFuture ? 0 : (activityMap.get(getDayKey(cellDate)) ?? 0);

    cells.push({
      date: cellDate,
      count,
      intensity: toIntensity(count),
      col,
      row,
      isFuture,
      isToday: cellDate.getTime() === today.getTime(),
    });
  }

  const totalRows = Math.ceil((startCol + daysInMonth) / 7);

  return {
    cells,
    monthLabel: `${MONTH_NAMES[month]!} ${year}`,
    totalRows,
  };
}

function filterWatchedDates(
  history: UserHistory,
  mode: DiscoverMode,
): ReadonlyArray<Date> {
  const movies = mode !== 'show'
    ? [...history.movies.values()].flatMap((m) => m.watchedDates)
    : [];
  const shows = mode !== 'movie'
    ? [...history.shows.values()].flatMap((s) => s.watchedDates)
    : [];
  return [...movies, ...shows];
}

export function useActivityHeatmap({ mode }: { mode: DiscoverMode }) {
  const { history } = useUser();

  const now = new Date();

  const heatmap = history.pipe(
    map(($history) => {
      if (!$history) return null;

      const watchedDates = filterWatchedDates($history, mode);

      return computeActivityHeatmap(watchedDates, now);
    }),
    shareReplay(1),
  );

  return {
    heatmap: heatmap.pipe(map(($h) => $h ?? null)),
    isLoading: heatmap.pipe(map(($h) => $h === null)),
  };
}
