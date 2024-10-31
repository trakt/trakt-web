import { readonly, writable } from 'svelte/store';
import { Theme } from '$lib/features//theme/models/Theme.ts';
import { coerceTheme } from '$lib/features/theme/utils/coerceTheme.ts';

export const nextTheme = (browser: boolean) => (theme: Theme) => {
  switch (theme) {
    case Theme.Dark:
      return Theme.Light;
    case Theme.Light:
      return Theme.Dark;
    case Theme.Auto:
    default:
      if (!browser) {
        return Theme.Light;
      }

      // @ts-ignore - globalThis is a browser-only object
      return globalThis.window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        ? Theme.Light
        : Theme.Dark;
  }
};

type Environment = {
  browser: boolean;
  seed: Theme;
};

export function store({
  browser,
  seed,
}: Environment) {
  const current = coerceTheme(seed);
  const theme = writable(current);

  return {
    theme: readonly(theme),
    setTheme: (value: Theme) => {
      theme.set(value);
      // @ts-ignore - globalThis is a browser-only object
      globalThis.document.documentElement.dataset.theme = value;
    },
    nextTheme: (theme: Theme) => nextTheme(browser)(theme),
  };
}
