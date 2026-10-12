import type { SeasonalThemeConfig } from './models/SeasonalThemeConfig.ts';
import type { SeasonalThemeId } from './models/SeasonalThemeId.ts';

export const THEME_COOKIE_NAME = 'trakt-theme';
export const SEASONAL_SPLASH_DISMISSAL_KEY = 'trakt_seasonal_splash_dismissal';
export const SEASONAL_THEMES: Record<SeasonalThemeId, SeasonalThemeConfig> = {
  halloween: {
    id: 'halloween',
    start: { month: 10, day: 30, hour: 20, minute: 0, second: 0 },
    end: { month: 11, day: 2, hour: 23, minute: 59, second: 59 },
    hasDiscoverFilters: true,
  },
  christmas: {
    id: 'christmas',
    start: { month: 12, day: 19, hour: 0, minute: 0, second: 0 },
    end: { month: 12, day: 30, hour: 23, minute: 59, second: 59 },
    hasDiscoverFilters: true,
  },
  'new-year': {
    id: 'new-year',
    start: { month: 12, day: 31, hour: 0, minute: 0, second: 0 },
    end: { month: 1, day: 2, hour: 23, minute: 59, second: 59 },
  },
};
