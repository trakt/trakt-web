import type { AnalyticsEngine } from '$lib/features/analytics/_internal/AnalyticsEngine.ts';
import type { AnalyticsData } from '$lib/features/analytics/AnalyticsData.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { getContext } from 'svelte';

export const ANALYTICS_CONTEXT = Symbol('analytics');

export function useAnalytics(): AnalyticsEngine {
  const analytics = assertDefined(
    getContext<AnalyticsEngine>(ANALYTICS_CONTEXT),
    'Analytics are only available within an AnalyticsProvider.',
  );

  function record(key: string, data: AnalyticsData) {
    analytics.record(key, data);
  }

  function setUser(user: string | Nil) {
    analytics.setUser(user);
  }

  return {
    setUser,
    record,
  };
}
