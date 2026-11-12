import { useMedia, WellKnownMediaQuery } from '$lib/stores/css/useMedia.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
} from 'rxjs';

export function useLargeScreen(): Observable<boolean> {
  return combineLatest([
    useMedia(WellKnownMediaQuery.tabletLarge),
    useMedia(WellKnownMediaQuery.desktop),
  ]).pipe(
    map(([isTabletLarge, isDesktop]) => isTabletLarge || isDesktop),
    distinctUntilChanged(),
  );
}
