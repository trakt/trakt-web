import { page } from '$app/state';
import { useToggler } from '$lib/components/toggles/useToggler.ts';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import type { AnalyticsEvent } from '../../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../analytics/useTrack.ts';
import { useUser } from '../../auth/stores/useUser.ts';
import type { FeatureFlag } from '../../feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '../../feature-flag/useFeatureFlag.ts';

type FlaggedModeId = 'recommendedMode' | 'relatedMode';

type ModeValue<T extends FlaggedModeId> = Parameters<
  ReturnType<typeof useToggler<T>>['set']
>[0];

type FlaggedModeParams<T extends FlaggedModeId> = {
  togglerId: T;
  event:
    | typeof AnalyticsEvent.RecommendedMode
    | typeof AnalyticsEvent.RelatedMode;
  flag: FeatureFlag;
  activeValue: ModeValue<T>;
};

export function useFlaggedMode<T extends FlaggedModeId>({
  togglerId,
  event,
  flag,
  activeValue,
}: FlaggedModeParams<T>) {
  const { options, set, current } = useToggler(togglerId);
  const { user } = useUser();
  const { isEnabled } = useFeatureFlag();
  const { track } = useTrack(event);

  const isActive = combineLatest([user, isEnabled(flag), current]).pipe(
    map(
      ([$user, $isEnabled, $current]) =>
        $isEnabled && $user.isDirector && $current.value === activeValue,
    ),
    distinctUntilChanged(),
  );

  const onModeChange = (value: ModeValue<T>) => {
    track({ mode: value, source: page.route.id ?? 'unknown' });
    set(value);
  };

  return { options, current, isActive, onModeChange };
}
