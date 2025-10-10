import { browser } from '$app/environment';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { computeVariable } from '$lib/stores/css/computeVariable.ts';
import { getContext } from 'svelte';
import { derived, type Writable, writable } from 'svelte/store';
import { THEME_COOKIE_NAME } from './constants.ts';
import type { ThemeResponse } from './handle.ts';
import { Theme } from './models/Theme.ts';
import { ThemeEndpoint } from './ThemeEndpoint.ts';

export function useTheme() {
  const theme: Writable<Theme> = getContext(THEME_COOKIE_NAME);
  const { track } = useTrack(AnalyticsEvent.Theme);
  const systemTheme = writable();

  async function set(value: Theme) {
    globalThis.document.documentElement.dataset.theme = value;

    track({ theme: value });
    theme.set(value);
    await fetch(ThemeEndpoint.Set, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme: value }),
    }).then((res) => res.json() as Promise<ThemeResponse>);
  }

  if (browser) {
    globalThis.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener(
        'change',
        (e) => {
          const system = e.matches ? Theme.Dark : Theme.Light;
          systemTheme.set(system);
        },
      );
  }

  return {
    set,
    theme,
    color: derived(
      [
        theme,
        systemTheme,
      ],
      () => {
        return {
          navbar: computeVariable(
            '--color-background-navbar-base',
          ),
          background: computeVariable(
            '--color-background',
          ),
          text: computeVariable(
            '--color-foreground',
          ),
        };
      },
    ),
  };
}
