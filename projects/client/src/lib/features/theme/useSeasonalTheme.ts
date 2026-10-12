import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
} from 'rxjs';
import { z } from 'zod';
import { safeLocalStorage } from '../../utils/storage/safeStorage.ts';
import { SEASONAL_THEMES } from './constants.ts';
import type { SeasonalThemeId } from './models/SeasonalThemeId.ts';
import { buildLocalDate } from './utils/buildLocalDate.ts';
import { resolveSeasonalWindow } from './utils/resolveSeasonalWindow.ts';

const SEASONAL_STORAGE_KEY_PREFIX = 'trakt_seasonal_splash_dismissal';
const SEASONAL_THEME_ATTRIBUTE = 'data-seasonal-theme';

const DismissalSchema = z.object({
  themeId: z.string(),
  dismissedAt: z.string(),
});

function isSeasonalThemeId(value: string | null): value is SeasonalThemeId {
  return value !== null && Object.hasOwn(SEASONAL_THEMES, value);
}

function readSeasonalTheme(): SeasonalThemeId | null {
  const value = document.documentElement.getAttribute(
    SEASONAL_THEME_ATTRIBUTE,
  );
  return isSeasonalThemeId(value) ? value : null;
}

function getWasDismissed(themeId: SeasonalThemeId): boolean {
  try {
    const value = safeLocalStorage.getItem(SEASONAL_STORAGE_KEY_PREFIX);
    if (!value) return false;

    const parsed = DismissalSchema.safeParse(JSON.parse(value));
    if (!parsed.success) return false;
    if (parsed.data.themeId !== themeId) return false;

    const dismissedAt = new Date(parsed.data.dismissedAt);
    const { start, end } = resolveSeasonalWindow({
      ...SEASONAL_THEMES[themeId],
      now: new Date(),
    });

    return dismissedAt >= buildLocalDate(start) &&
      dismissedAt <= buildLocalDate(end);
  } catch {
    return false;
  }
}

const activeTheme = new Observable<SeasonalThemeId | null>((subscriber) => {
  subscriber.next(null);
  if (typeof document === 'undefined') return;

  queueMicrotask(() => subscriber.next(readSeasonalTheme()));

  const observer = new MutationObserver(() =>
    subscriber.next(readSeasonalTheme())
  );
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [SEASONAL_THEME_ATTRIBUTE],
  });

  return () => observer.disconnect();
}).pipe(
  distinctUntilChanged(),
  shareReplay({ bufferSize: 1, refCount: true }),
);

export function useSeasonalTheme() {
  const dismissedTheme = new BehaviorSubject<SeasonalThemeId | null>(null);

  return {
    activeTheme,
    hasSplashScreen: combineLatest([activeTheme, dismissedTheme]).pipe(
      map(([theme, dismissed]) => {
        if (theme === null) return false;
        if (theme === dismissed) return false;

        return !getWasDismissed(theme);
      }),
    ),
    dismissSplashScreen: (themeId: SeasonalThemeId) => {
      const dismissal = {
        themeId,
        dismissedAt: new Date().toISOString(),
      };
      safeLocalStorage.setItem(
        SEASONAL_STORAGE_KEY_PREFIX,
        JSON.stringify(dismissal),
      );

      dismissedTheme.next(themeId);
    },
  };
}
