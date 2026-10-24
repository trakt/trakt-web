import type { NavigationType } from '@sveltejs/kit';
import type { InsightsOpenSource } from './models/InsightsOpenSource.ts';

export function toInsightsOpenSource(
  navigationType: NavigationType,
): InsightsOpenSource {
  return navigationType === 'link' ? 'card' : 'link';
}
