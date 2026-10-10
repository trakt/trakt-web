import type { SeasonalThemeConfig } from './models/SeasonalThemeConfig.ts';

export const THEME_COOKIE_NAME = 'trakt-theme';
export const SEASONAL_THEMES: Record<string, SeasonalThemeConfig> = {
  halloween: {
    id: 'halloween',
    start: { year: 2025, month: 10, day: 30, hour: 20, minute: 0, second: 0 },
    end: { year: 2025, month: 11, day: 2, hour: 23, minute: 59, second: 59 },
    actionBarImage: 'ghost.png',
  },
  christmas: {
    id: 'christmas',
    start: { year: 2025, month: 12, day: 19, hour: 0, minute: 0, second: 0 },
    end: { year: 2025, month: 12, day: 30, hour: 23, minute: 59, second: 59 },
    actionBarImage: 'hat.png',
  },
};
