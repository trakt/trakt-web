import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { FeatureFlag } from '../feature-flag/models/FeatureFlag.ts';
import { useFlaggedMode } from './_internal/useFlaggedMode.ts';

export function useRelatedMode() {
  const { isActive, ...mode } = useFlaggedMode({
    togglerId: 'relatedMode',
    event: AnalyticsEvent.RelatedMode,
    flag: FeatureFlag.PersonalizedRelated,
    activeValue: 'personal',
  });

  return { ...mode, isPersonalized: isActive };
}
