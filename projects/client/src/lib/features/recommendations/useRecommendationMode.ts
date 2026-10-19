import { page } from '$app/state';
import { useToggler } from '$lib/components/toggles/useToggler.ts';
import type { RecommendationMode } from '$lib/requests/models/RecommendationMode.ts';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../analytics/useTrack.ts';
import { FeatureFlag } from '../feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '../feature-flag/useFeatureFlag.ts';

export function useRecommendationMode() {
  const { options, set, current } = useToggler('recommendationMode');
  const { isEnabled } = useFeatureFlag();
  const { track } = useTrack(AnalyticsEvent.RecommendationMode);

  const isApplicable = isEnabled(FeatureFlag.SmartRecommendations).pipe(
    distinctUntilChanged(),
  );

  const requestMode = combineLatest([isApplicable, current]).pipe(
    map(([$isApplicable, $current]): RecommendationMode | undefined =>
      $isApplicable ? $current.value : undefined,
    ),
    distinctUntilChanged(),
  );

  const onModeChange = (value: RecommendationMode) => {
    track({ mode: value, source: page.route.id ?? 'unknown' });
    set(value);
  };

  return {
    options,
    current,
    isApplicable,
    requestMode,
    onModeChange,
  };
}
