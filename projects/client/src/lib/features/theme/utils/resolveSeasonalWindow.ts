import type { EventConfig } from '$lib/features/events/models/EventConfig.ts';
import type { SeasonalDate } from '../models/SeasonalThemeConfig.ts';

type ResolveSeasonalWindowProps = {
  start: SeasonalDate;
  end: SeasonalDate;
  now: Date;
};

export function resolveSeasonalWindow({
  start,
  end,
  now,
}: ResolveSeasonalWindowProps): EventConfig {
  const year = now.getFullYear();
  const isYearCrossing = end.month < start.month;

  if (!isYearCrossing) {
    return { start: { ...start, year }, end: { ...end, year } };
  }

  const isInTrailingYear = now.getMonth() + 1 <= end.month;
  const startYear = isInTrailingYear ? year - 1 : year;

  return {
    start: { ...start, year: startYear },
    end: { ...end, year: startYear + 1 },
  };
}
