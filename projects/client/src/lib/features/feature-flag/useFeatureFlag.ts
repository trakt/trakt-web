import { map } from 'rxjs';
import { safeLocalStorage } from '../../utils/storage/safeStorage.ts';
import { FEATURE_FLAG_LOCAL_STORAGE_KEY } from './_internal/createFeatureFlagContext.ts';
import { getFeatureFlagContext } from './_internal/getFeatureFlagContext.ts';
import type { FeatureFlag } from './models/FeatureFlag.ts';

export function useFeatureFlag() {
  const { flags } = getFeatureFlagContext();

  const setFlag = (flag: FeatureFlag, value: boolean) => {
    const updatedFlags = { ...flags.getValue(), [flag]: value };
    safeLocalStorage.setItem(
      FEATURE_FLAG_LOCAL_STORAGE_KEY,
      JSON.stringify(updatedFlags),
    );
    flags.next(updatedFlags);
  };

  return {
    isEnabled: (flag: FeatureFlag) => flags.pipe(map(($flags) => $flags[flag])),
    setFlag,
    flags,
  };
}
