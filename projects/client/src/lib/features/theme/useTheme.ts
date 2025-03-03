import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { computeVariable } from '$lib/stores/css/computeVariable.ts';
import { getContext } from 'svelte';
import { derived, type Writable } from 'svelte/store';
import { THEME_COOKIE_NAME } from './constants.ts';
import { Theme } from './models/Theme.ts';

export function useTheme() {
  const theme: Writable<Theme> = getContext(THEME_COOKIE_NAME);
  const { track } = useTrack(AnalyticsEvent.Theme);

  function set(value: Theme) {
    globalThis.document.documentElement.dataset.theme = value;

    track({ theme: value });
    theme.set(value);
  }

  return {
    set,
    theme,
    color: derived(
      theme,
      () =>
        computeVariable(
          '--color-background',
        ),
    ),
  };
}
