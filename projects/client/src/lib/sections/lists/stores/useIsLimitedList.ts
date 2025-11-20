import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { useMedia, WellKnownMediaQuery } from '$lib/stores/css/useMedia.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { combineLatest, map } from 'rxjs';

export function useIsLimitedList() {
  const { isEnabled } = useFeatureFlag(FeatureFlag.LimitLists);

  const isFlagEnabled$ = toObservable(isEnabled);
  const isTabletLarge$ = useMedia(WellKnownMediaQuery.tabletLarge);
  const isDesktop$ = useMedia(WellKnownMediaQuery.desktop);

  return combineLatest([isFlagEnabled$, isTabletLarge$, isDesktop$])
    .pipe(
      map(([isEnabled, isTabletLarge, isDesktop]) =>
        isEnabled && (isTabletLarge || isDesktop)
      ),
    );
}
