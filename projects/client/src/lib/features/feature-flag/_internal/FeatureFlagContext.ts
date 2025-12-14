import type { BehaviorSubject } from 'rxjs';
import type { FeatureFlag } from '../models/FeatureFlag.ts';

type FeatureFlags = {
  [key in FeatureFlag]: boolean;
};

export type FeatureFlagContext = {
  flags: BehaviorSubject<FeatureFlags>;
};
