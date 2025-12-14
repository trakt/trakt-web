import { asset } from '$app/paths';
import { BehaviorSubject, map } from 'rxjs';
import { onMount } from 'svelte';
import { SEASONAL_THEMES } from './constants.ts';

export function useSeasonalTheme() {
  const activeTheme = new BehaviorSubject<string | null>(null);

  const checkSeasonalTheme = () => {
    const theme = document.documentElement.getAttribute('data-seasonal-theme');
    activeTheme.next(theme);
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
  };
}
