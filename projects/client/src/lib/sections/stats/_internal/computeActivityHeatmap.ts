import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { addDays } from '$lib/utils/date/addDays.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import type { HeatmapCell } from './models/HeatmapCell.ts';
import type { HeatmapIntensity } from './models/HeatmapIntensity.ts';

type HeatmapData = {
  readonly cells: ReadonlyArray<HeatmapCell>;
  readonly monthLabel: string;
  readonly dayLabels: ReadonlyArray<string>;
  readonly totalRows: number;
};

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
  locale: AvailableLocale,
  period: 'month' | 'week' = 'month',
): HeatmapData {
  const activityMap = new Map<string, number>();
  for (const date of watchedDates) {
    const key = getDayKey(date);
    activityMap.set(key, (activityMap.get(key) ?? 0) + 1);
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const year = today.getFullYear();
  const month = today.getMonth();

  const iterStart = period === 'week'
    ? getStartOfWeek(today, locale)
    : new Date(year, month, 1);

  const iterCount = period === 'week'
    ? 7
    : new Date(year, month + 1, 0).getDate();

  const gridStart = getStartOfWeek(iterStart, locale);
  const msPerDay = 1000 * 60 * 60 * 24;
  const startOffset = Math.round(
    (iterStart.getTime() - gridStart.getTime()) / msPerDay,
  );

  const cells = Array.from({ length: iterCount }, (_, i) => {
    const cellDate = addDays(iterStart, i);
    const isFuture = cellDate > today;
    const count = isFuture ? 0 : (activityMap.get(getDayKey(cellDate)) ?? 0);
    const position = startOffset + i;

    return {
      date: cellDate,
      count,
      intensity: toIntensity(count),
      col: position % 7,
      row: Math.floor(position / 7),
      isFuture,
      isToday: cellDate.getTime() === today.getTime(),
    };
  });

  const totalRows = (cells.at(-1)?.row ?? -1) + 1;

  const monthLabel = period === 'month'
    ? new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
    }).format(new Date(year, month, 1))
    : '';

  const dayLabels = Array.from(
    { length: 7 },
    (_, i) =>
      new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(
        addDays(gridStart, i),
      ),
  );

  return { cells, monthLabel, dayLabels, totalRows };
}
