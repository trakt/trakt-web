import type { AnalyticsEngine } from '$lib/features/analytics/_internal/AnalyticsEngine.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { getContext } from 'svelte';

export const ANALYTICS_CONTEXT = Symbol('analytics');

export function useAnalytics(): AnalyticsEngine {
  const analytics = getContext<AnalyticsEngine>(ANALYTICS_CONTEXT);

  return assertDefined(
    analytics,
    'Analytics are only available within an AnalyticsProvider.',
  );
}
