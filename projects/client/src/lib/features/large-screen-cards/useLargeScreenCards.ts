import { useMedia, WellKnownMediaQuery } from '$lib/stores/css/useMedia.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
} from 'rxjs';
import { useLargeScreen } from './useLargeScreen.ts';

export function useLargeScreenCards(): Observable<boolean> {
  return combineLatest([
    useLargeScreen(),
    useMedia(WellKnownMediaQuery.mouse),
  ]).pipe(
    map(([isLargeScreen, isMouse]) => isLargeScreen && isMouse),
    distinctUntilChanged(),
  );
}
