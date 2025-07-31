import { getContext } from 'svelte';
import type { FeatureFlagContext } from './FeatureFlagContext.ts';
import { FEATURE_FLAG_CONTEXT_KEY } from './FeatureFlagContextKey.ts';

export function getFeatureFlagContext() {
  const context = getContext<FeatureFlagContext>(FEATURE_FLAG_CONTEXT_KEY);

  if (!context) {
    throw new Error(
      'Feature flag context not found. Make sure to call use this within the FeatureFlagProvider scope.',
    );
  }

  return context;
}
