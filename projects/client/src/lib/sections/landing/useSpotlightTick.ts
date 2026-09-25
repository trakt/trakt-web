import { browser } from '$app/environment';
import { useMedia, WellKnownMediaQuery } from '$lib/stores/css/useMedia.ts';
import {
  EMPTY,
  interval,
  map,
  merge,
  of,
  scan,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';

const SPOTLIGHT_INTERVAL_MS = 4000;

export function useSpotlightTick() {
  const steps = new Subject<number>();
  const step = (delta: number) => steps.next(delta);

  if (!browser) return { tick: of(0), step };

  const autoplay = useMedia(WellKnownMediaQuery.reducedMotion).pipe(
    switchMap((isReducedMotion) =>
      isReducedMotion ? EMPTY : steps.pipe(
        startWith(0),
        switchMap(() => interval(SPOTLIGHT_INTERVAL_MS).pipe(map(() => 1))),
      )
    ),
  );

  const tick = merge(autoplay, steps).pipe(
    scan((total, delta) => total + delta, 0),
    startWith(0),
  );

  return { tick, step };
}
