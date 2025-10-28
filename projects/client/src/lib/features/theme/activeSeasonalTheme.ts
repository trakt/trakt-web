import { assertDefined } from '../../utils/assert/assertDefined.ts';
import { SEASONAL_THEMES } from './constants.ts';
import type { SeasonalThemeConfig } from './models/SeasonalThemeConfig.ts';
import { buildLocalDate } from './utils/buildLocalDate.ts';

function isDateInScope(now: Date, cfg: SeasonalThemeConfig): boolean {
  const start = buildLocalDate(cfg.start);
  const end = buildLocalDate(cfg.end);
  return now >= start && now <= end;
}

/**
 * Return an array of active scope ids at the given time. Order is the insertion order of SCOPES keys.
 */
export function activeSeasonalTheme(now: Date): string[] {
  return Object.keys(SEASONAL_THEMES).filter((k) =>
    isDateInScope(
      now,
      assertDefined(SEASONAL_THEMES[k], 'Seasonal theme config not found'),
    )
  );
}
