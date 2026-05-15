import { browser } from '$app/environment';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { computeVariable } from '$lib/stores/css/computeVariable.ts';
import { retry } from '$lib/utils/retry/retry.ts';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { getContext } from 'svelte';
import { THEME_COOKIE_NAME } from './constants.ts';
import { Theme } from './models/Theme.ts';
import { ThemeEndpoint } from './ThemeEndpoint.ts';

export function useTheme() {
  const theme: BehaviorSubject<Theme> = getContext(THEME_COOKIE_NAME);
  const { track } = useTrack(AnalyticsEvent.Theme);
  const systemTheme = new BehaviorSubject<Theme | undefined>(undefined);

  async function set(value: Theme) {
    globalThis.document.documentElement.dataset.theme = value;

    track({ theme: value });
    theme.next(value);

    const response = await retry(() =>
      fetch(ThemeEndpoint.Set, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: value }),
      })
    );

    if (!response.ok) {
      return;
    }

    try {
      await response.json();
    } catch {
      // The theme is already applied optimistically client-side, so an
      // empty or non-JSON body (e.g., an HTML error page from an
      // intermediary CDN) is safe to swallow.
    }
  }

  if (browser) {
    globalThis.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener(
        'change',
        (e) => {
          const system = e.matches ? Theme.Dark : Theme.Light;
          systemTheme.next(system);
        },
      );
  }

  return {
    set,
    theme: theme.asObservable(),
    color: combineLatest(
      [theme, systemTheme],
    ).pipe(
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
