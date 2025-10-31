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
    /**
     * TODO: (@seferturan) make filtering smarter, do not assume discover route
     */
    filters: [
      {
        id: 'trending',
        movie: { 'subgenres': 'halloween' },
        show: { 'subgenres': 'halloween' },
      },
      {
        id: 'recommended',
        movie: { 'subgenres': 'halloween' },
        show: {
          'genres': 'horror',
          'subgenres':
            'halloween,haunting,nightmare,witch,monster,demon,occult,supernatural',
        },
      },
      {
        id: 'anticipated',
        movie: {
          'subgenres': 'halloween',
          'years': '2022-2025',
        },
        show: {
          'genres': 'horror',
          'subgenres':
            'halloween,haunting,nightmare,witch,monster,demon,occult,supernatural',
          'years': '2022-2025',
        },
      },
      {
        id: 'popular',
        movie: {
          'subgenres': 'halloween',
          'years': '1990-2025',
        },
        show: {
          'subgenres': 'halloween',
          'years': '1990-2025',
        },
      },
    ],
    actionBarImage: 'ghost.png',
  },
};
