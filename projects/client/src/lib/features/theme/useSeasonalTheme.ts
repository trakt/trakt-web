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
    activeTheme,
    themeFilters: activeTheme.pipe(map((at) => {
      if (!at) {
        return;
      }

      return SEASONAL_THEMES[at]?.filters;
    })),
    actionBarImageSrc: activeTheme.pipe(map((at) => {
      if (!at) {
        return null;
      }

      const config = SEASONAL_THEMES[at];
      return config?.actionBarImage
        ? asset(`/seasonal/${config.actionBarImage}`)
        : null;
    })),
  };
}
