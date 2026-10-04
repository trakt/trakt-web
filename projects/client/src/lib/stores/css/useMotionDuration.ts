import { map, type Observable } from 'rxjs';
import { useMedia, WellKnownMediaQuery } from './useMedia.ts';

export function useMotionDuration(): Observable<(duration: number) => number> {
  return useMedia(WellKnownMediaQuery.reducedMotion).pipe(
    map((isReducedMotion) => (duration: number) =>
      isReducedMotion ? 0 : duration
    ),
  );
}
