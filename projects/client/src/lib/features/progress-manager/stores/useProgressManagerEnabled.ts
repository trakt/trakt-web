import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';

export function useProgressManagerEnabled() {
  const { isEnabled } = useFeatureFlag();
  const { user } = useUser();

  return combineLatest([isEnabled(FeatureFlag.ProgressManager), user]).pipe(
    map(([isFlagEnabled, $user]) => isFlagEnabled && Boolean($user?.isVip)),
    distinctUntilChanged(),
  );
}
