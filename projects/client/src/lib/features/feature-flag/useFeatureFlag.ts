import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { safeLocalStorage } from '../../utils/storage/safeStorage.ts';
import { FEATURE_FLAG_LOCAL_STORAGE_KEY } from './_internal/createFeatureFlagContext.ts';
import { getFeatureFlagContext } from './_internal/getFeatureFlagContext.ts';
import { FeatureFlag } from './models/FeatureFlag.ts';

export function useFeatureFlag() {
  const { overrides } = getFeatureFlagContext();
  const { user } = useUser();

  const isDirector = user.pipe(
    map((currentUser) => currentUser?.isDirector ?? false),
    distinctUntilChanged(),
  );

  // Director accounts get every flag defaulted to on; overrides (manual
  // toggles persisted to localStorage) always win.
  const flags = combineLatest([overrides, isDirector]).pipe(
    map(([overrideValues, isDirectorValue]) =>
      Object.fromEntries(
        Object.values(FeatureFlag).map((flag) => [
          flag,
          overrideValues[flag] ?? isDirectorValue,
        ]),
      ) as Record<FeatureFlag, boolean>
    ),
  );

  const setFlag = (flag: FeatureFlag, value: boolean) => {
    const updatedOverrides = { ...overrides.getValue(), [flag]: value };
    safeLocalStorage.setItem(
      FEATURE_FLAG_LOCAL_STORAGE_KEY,
      JSON.stringify(updatedOverrides),
    );
    overrides.next(updatedOverrides);
  };

  return {
    isEnabled: (flag: FeatureFlag) => flags.pipe(map(($flags) => $flags[flag])),
    setFlag,
    flags,
  };
}
