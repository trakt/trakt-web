import { asset } from '$app/paths';
import { onMount } from 'svelte';
import { derived, writable } from 'svelte/store';
import { SEASONAL_THEMES } from './constants.ts';

export function useSeasonalTheme() {
  const activeTheme = writable<string | null>(null);

  const checkSeasonalTheme = () => {
    const theme = document.documentElement.getAttribute('data-seasonal-theme');
    activeTheme.set(theme);
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
    themeFilters: derived(activeTheme, ($activeTheme) => {
      if (!$activeTheme) {
        return;
      }

      return SEASONAL_THEMES[$activeTheme]?.filters;
    }),
    actionBarImageSrc: derived(activeTheme, ($activeTheme) => {
      if (!$activeTheme) {
        return null;
      }

      const config = SEASONAL_THEMES[$activeTheme];
      return config?.actionBarImage
        ? asset(`/seasonal/${config.actionBarImage}`)
        : null;
    }),
  };
}
