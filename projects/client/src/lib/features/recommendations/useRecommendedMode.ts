import { page } from '$app/state';
import { useToggler } from '$lib/components/toggles/useToggler.ts';
import type { RecommendedMode } from '$lib/requests/models/RecommendedMode.ts';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../analytics/useTrack.ts';
import { useUser } from '../auth/stores/useUser.ts';
import { FeatureFlag } from '../feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '../feature-flag/useFeatureFlag.ts';

export function useRecommendedMode() {
  const { options, set, current } = useToggler('recommendedMode');
  const { user } = useUser();
  const { isEnabled } = useFeatureFlag();
  const { track } = useTrack(AnalyticsEvent.RecommendedMode);

  const isAnticipated = combineLatest([
    user,
    isEnabled(FeatureFlag.AnticipatedRecommendations),
    current,
  ]).pipe(
    map(
      ([$user, $isEnabled, $current]) =>
        $isEnabled && $user.isDirector && $current.value === 'coming-soon',
    ),
    distinctUntilChanged(),
  );

  const onModeChange = (value: RecommendedMode) => {
    track({ mode: value, source: page.route.id ?? 'unknown' });
    set(value);
  };

  return {
    options,
    current,
    isAnticipated,
    onModeChange,
  };
}
