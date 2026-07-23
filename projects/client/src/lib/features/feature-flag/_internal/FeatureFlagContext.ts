import type { BehaviorSubject } from 'rxjs';
import type { FeatureFlag } from '../models/FeatureFlag.ts';

export type FeatureFlagOverrides = Partial<Record<FeatureFlag, boolean>>;

export type FeatureFlagContext = {
  overrides: BehaviorSubject<FeatureFlagOverrides>;
  readFeatures: BehaviorSubject<ReadonlyArray<string>>;
};
