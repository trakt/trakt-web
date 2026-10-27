import type { NavigationType } from '@sveltejs/kit';
import type { InsightsOpenSource } from './models/InsightsOpenSource.ts';

export function toInsightsOpenSource(
  navigationType: NavigationType,
): InsightsOpenSource | Nil {
  if (navigationType === 'leave') {
    return null;
  }

  return navigationType === 'link' ? 'card' : 'link';
}
