import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { FeatureFlag } from '../feature-flag/models/FeatureFlag.ts';
import { useFlaggedMode } from './_internal/useFlaggedMode.ts';

export function useRecommendedMode() {
  const { isActive, ...mode } = useFlaggedMode({
    togglerId: 'recommendedMode',
    event: AnalyticsEvent.RecommendedMode,
    flag: FeatureFlag.AnticipatedRecommendations,
    activeValue: 'coming-soon',
  });

  return { ...mode, isAnticipated: isActive };
}
