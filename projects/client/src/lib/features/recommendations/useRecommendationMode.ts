import { page } from '$app/state';
import { useToggler } from '$lib/components/toggles/useToggler.ts';
import type { RecommendationMode } from '$lib/requests/models/RecommendationMode.ts';
import { distinctUntilChanged, map } from 'rxjs';
import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../analytics/useTrack.ts';

export function useRecommendationMode() {
  const { options, set, current } = useToggler('recommendationMode');
  const { track } = useTrack(AnalyticsEvent.RecommendationMode);

  const requestMode = current.pipe(
    map(($current): RecommendationMode => $current.value),
    distinctUntilChanged(),
  );

  const onModeChange = (value: RecommendationMode) => {
    track({ mode: value, source: page.route.id ?? 'unknown' });
    set(value);
  };

  return {
    options,
    current,
    requestMode,
    onModeChange,
  };
}
