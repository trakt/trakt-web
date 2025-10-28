import type { SeasonalThemeConfig } from './models/SeasonalThemeConfig.ts';

export const THEME_COOKIE_NAME = 'trakt-theme';
export const SEASONAL_THEMES: Record<string, SeasonalThemeConfig> = {
  halloween: {
    id: 'halloween',
    /**
     * TODO: (@seferturan) add support for year agnostic ranges like
     */
    start: { year: 2025, month: 9, day: 30, hour: 20, minute: 0, second: 0 },
    end: { year: 2025, month: 10, day: 2, hour: 23, minute: 59, second: 59 },
  },
};
