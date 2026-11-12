import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useMedia, WellKnownMediaQuery } from '$lib/stores/css/useMedia.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
} from 'rxjs';
import { useLargeScreen } from './useLargeScreen.ts';

export function useLargeScreenCards(): Observable<boolean> {
  const { isEnabled } = useFeatureFlag();

  return combineLatest([
    isEnabled(FeatureFlag.LargeScreenCards),
    useLargeScreen(),
    useMedia(WellKnownMediaQuery.mouse),
  ]).pipe(
    map(
      ([isFlagEnabled, isLargeScreen, isMouse]) =>
        isFlagEnabled && isLargeScreen && isMouse,
    ),
    distinctUntilChanged(),
  );
}
