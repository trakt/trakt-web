import type { AnalyticsEngine } from '$lib/features/analytics/_internal/AnalyticsEngine.ts';
import type { AnalyticsData } from '$lib/features/analytics/AnalyticsData.ts';
import { getContext } from 'svelte';
import { assertDefined } from '../../utils/assert/assertDefined.ts';
import { NOOP_FN } from '../../utils/constants.ts';

export const ANALYTICS_CONTEXT = Symbol('analytics');

export function useAnalytics(): AnalyticsEngine {
  if (!getContext(ANALYTICS_CONTEXT)) {
    return {
      setUser: NOOP_FN,
      record: NOOP_FN,
    };
  }

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
