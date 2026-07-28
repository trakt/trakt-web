import type { AnalyticsEngine } from '$lib/features/analytics/_internal/AnalyticsEngine.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { getContext } from 'svelte';

export const ANALYTICS_CONTEXT = Symbol('analytics');

export function useAnalytics(): AnalyticsEngine {
  if (!getContext(ANALYTICS_CONTEXT)) {
    return {
      record: NOOP_FN,
    };
  }

  return assertDefined(
    getContext<AnalyticsEngine>(ANALYTICS_CONTEXT),
    'Analytics are only available within an AnalyticsProvider.',
  );
}
