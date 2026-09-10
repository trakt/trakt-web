import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useMedia, WellKnownMediaQuery } from '$lib/stores/css/useMedia.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
} from 'rxjs';

export function useLargeScreenCards(): Observable<boolean> {
  const { isEnabled } = useFeatureFlag();

  return combineLatest([
    isEnabled(FeatureFlag.LargeScreenCards),
    useMedia(WellKnownMediaQuery.tabletLarge),
    useMedia(WellKnownMediaQuery.desktop),
  ]).pipe(
    map(([isFlagEnabled, isTabletLarge, isDesktop]) =>
      isFlagEnabled && (isTabletLarge || isDesktop)
    ),
    distinctUntilChanged(),
  );
}
