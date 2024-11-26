import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';
import { THEME_STORE_NAME } from './constants.ts';
import { Theme } from './models/Theme.ts';

export function useTheme() {
  const theme: Writable<Theme> = getContext(THEME_STORE_NAME);

  function set(value: Theme) {
    theme.set(value);
    globalThis.document.documentElement.dataset.theme = value;
  }

  return { set, theme };
}
