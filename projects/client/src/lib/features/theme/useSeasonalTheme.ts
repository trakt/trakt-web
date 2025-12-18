import { asset } from '$app/paths';
import { BehaviorSubject, map } from 'rxjs';
import { onMount } from 'svelte';
import { assertDefined } from '../../utils/assert/assertDefined.ts';
import { safeLocalStorage } from '../../utils/storage/safeStorage.ts';
import { SEASONAL_THEMES } from './constants.ts';
import type { SeasonalThemeConfig } from './models/SeasonalThemeConfig.ts';
import { buildLocalDate } from './utils/buildLocalDate.ts';

const SEASONAL_STORAGE_KEY_PREFIX = 'trakt_seasonal_splash_dismissal';

function getThemeConfig(themeId: string): SeasonalThemeConfig {
  const theme = assertDefined(
    SEASONAL_THEMES[themeId],
    'Invalid seasonal theme id',
  );
  return theme;
}

function getWasDismissed(themeId: string): boolean {
  try {
    const value = safeLocalStorage.getItem(SEASONAL_STORAGE_KEY_PREFIX);
    if (!value) return false;
    const parsed = JSON.parse(value);

    const theme = getThemeConfig(themeId);
    const dismissedAt = new Date(parsed.dismissedAt);
    const themeEnd = buildLocalDate(theme.end);

    return dismissedAt < themeEnd;
  } catch {
    return false;
  }
}

export function useSeasonalTheme() {
  const activeTheme = new BehaviorSubject<string | null>(null);
  const hasSplashScreen = new BehaviorSubject<boolean>(false);

  const checkSeasonalTheme = () => {
    const theme = document.documentElement.getAttribute('data-seasonal-theme');
    activeTheme.next(theme);

    const wasDismissedBefore = theme && getWasDismissed(theme);
    hasSplashScreen.next(!wasDismissedBefore);
  };

  onMount(() => {
    checkSeasonalTheme();

    const observer = new MutationObserver(() => checkSeasonalTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-seasonal-theme'],
    });
    return () => observer.disconnect();
  });

  return {
    activeTheme: activeTheme.asObservable(),
    themeFilters: activeTheme.pipe(
      map(($activeTheme) => {
        if (!$activeTheme) {
          return;
        }

        return SEASONAL_THEMES[$activeTheme]?.filters;
      }),
    ),
    actionBarImageSrc: activeTheme.pipe(
      map(($activeTheme) => {
        if (!$activeTheme) {
          return null;
        }

        const config = SEASONAL_THEMES[$activeTheme];
        return config?.actionBarImage
          ? asset(`/seasonal/${config.actionBarImage}`)
          : null;
      }),
    ),
    hasSplashScreen: hasSplashScreen.asObservable(),
    dismissSplashScreen: (themeId: string) => {
      const dismissal = {
        themeId,
        dismissedAt: new Date().toISOString(),
      };
      safeLocalStorage.setItem(
        SEASONAL_STORAGE_KEY_PREFIX,
        JSON.stringify(dismissal),
      );

      hasSplashScreen.next(false);
    },
  };
}
