import { derived } from 'svelte/store';
import { getFeatureFlagContext } from './_internal/getFeatureFlagContext.ts';
import type { FeatureFlag } from './models/FeatureFlag.ts';

export function useFeatureFlag(flag: FeatureFlag) {
  const { flags } = getFeatureFlagContext();

  return {
    isEnabled: derived(flags, ($flags) => $flags[flag]),
  };
}
