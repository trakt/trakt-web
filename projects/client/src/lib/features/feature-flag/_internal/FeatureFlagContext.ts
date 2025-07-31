import type { Writable } from 'svelte/store';
import type { FeatureFlag } from '../models/FeatureFlag.ts';

type FeatureFlags = {
  [key in FeatureFlag]: boolean;
};

export type FeatureFlagContext = {
  flags: Writable<FeatureFlags>;
};
