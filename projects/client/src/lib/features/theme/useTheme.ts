import { browser } from '$app/environment';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { computeVariable } from '$lib/stores/css/computeVariable.ts';
import {
  BehaviorSubject,
  combineLatest,
  fromEvent,
  map,
  of,
  shareReplay,
  startWith,
} from 'rxjs';
import { getContext } from 'svelte';
import { THEME_COOKIE_NAME } from './constants.ts';
import type { ThemeResponse } from './handle.ts';
import { Theme } from './models/Theme.ts';
import { ThemeEndpoint } from './ThemeEndpoint.ts';

export function useTheme() {
  const theme: BehaviorSubject<Theme> = getContext(THEME_COOKIE_NAME);
  const { track } = useTrack(AnalyticsEvent.Theme);

  async function set(value: Theme) {
    globalThis.document.documentElement.dataset.theme = value;

    track({ theme: value });
    theme.next(value);
    await fetch(ThemeEndpoint.Set, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme: value }),
    }).then((res) => res.json() as Promise<ThemeResponse>);
  }

  const systemTheme$ = !browser ? of(Theme.Light) : (() => {
    const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');
    return fromEvent<MediaQueryListEvent>(mediaQuery, 'change').pipe(
      startWith(mediaQuery),
      map((m) => (m.matches ? Theme.Dark : Theme.Light)),
      shareReplay(1),
    );
  })();

  const theme$ = theme.asObservable();

  return {
    set,
    theme: theme$,
    color: combineLatest([theme$, systemTheme$]).pipe(
      map(() => {
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
      }),
    ),
  };
}
