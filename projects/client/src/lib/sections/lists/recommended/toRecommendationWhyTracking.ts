import type { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import type { AnalyticsEventDataMap } from '$lib/features/analytics/events/AnalyticsEventDataMap.ts';
import type { RecommendedEntry } from './useRecommendedList.ts';

export function toRecommendationWhyTracking(
  media: Pick<RecommendedEntry, 'people' | 'sources'>,
): AnalyticsEventDataMap[typeof AnalyticsEvent.RecommendationWhy] {
  if (media.people.length > 0) return { reason: 'people' };
  if (media.sources.length > 0) return { reason: 'titles' };
  return { reason: 'empty' };
}
