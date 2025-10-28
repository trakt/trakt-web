import { assertDefined } from '../../utils/assert/assertDefined.ts';
import { SEASONAL_THEMES } from './constants.ts';
import type { SeasonalThemeConfig } from './models/SeasonalThemeConfig.ts';
import { buildLocalDate } from './utils/buildLocalDate.ts';

/**
 * Return milliseconds until the next transition (start or end+1s), or null if no upcoming transition.
 * Caller should clamp to setTimeout limits.
 */
function msUntilNextTransition(
  now: Date,
  cfg: SeasonalThemeConfig,
): number | null {
  const start = buildLocalDate(cfg.start).getTime();
  const end = buildLocalDate(cfg.end).getTime();
  const time = now.getTime();

  if (time < start) return start - time;
  if (time >= start && time <= end) return end - time + 1000;
  return null;
}

/**
 * Return the milliseconds until the next transition for any known scope, or null if none.
 * This is the minimum positive msUntilNextTransition across all scopes.
 */
export function msUntilNextSeasonalTheme(now: Date): number | null {
  const times = Object.keys(SEASONAL_THEMES)
    .map((k) =>
      msUntilNextTransition(
        now,
        assertDefined(SEASONAL_THEMES[k], 'Seasonal theme config not found'),
      )
    )
    .filter((v): v is number => typeof v === 'number' && v > 0);

  if (times.length === 0) return null;
  return Math.min(...times);
}
