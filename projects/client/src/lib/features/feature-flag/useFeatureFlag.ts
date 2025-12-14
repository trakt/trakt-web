import { map } from 'rxjs';
import { getFeatureFlagContext } from './_internal/getFeatureFlagContext.ts';
import type { FeatureFlag } from './models/FeatureFlag.ts';

export function useFeatureFlag(flag: FeatureFlag) {
  const { flags } = getFeatureFlagContext();

  return {
    isEnabled: flags.pipe(map(($flags) => $flags[flag])),
  };
}
