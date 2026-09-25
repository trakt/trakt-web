import { browser } from '$app/environment';
import { useMedia, WellKnownMediaQuery } from '$lib/stores/css/useMedia.ts';
import { interval, map, of, startWith, switchMap } from 'rxjs';

const SPOTLIGHT_INTERVAL_MS = 4000;

export function useSpotlightTick() {
  if (!browser) return of(0);

  return useMedia(WellKnownMediaQuery.reducedMotion).pipe(
    switchMap((isReducedMotion) =>
      isReducedMotion ? of(0) : interval(SPOTLIGHT_INTERVAL_MS).pipe(
        map((tick) => tick + 1),
        startWith(0),
      )
    ),
  );
}
