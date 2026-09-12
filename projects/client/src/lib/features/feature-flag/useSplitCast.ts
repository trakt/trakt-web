import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { FeatureFlag } from './models/FeatureFlag.ts';
import { useFeatureFlag } from './useFeatureFlag.ts';

export function useSplitCast() {
  const { isAuthorized } = useAuth();
  const { user } = useUser();
  const { isEnabled } = useFeatureFlag();

  return combineLatest([
    isEnabled(FeatureFlag.SplitCast),
    isAuthorized,
    user,
  ]).pipe(
    map(([enabled, authorized, currentUser]) =>
      enabled && authorized && Boolean(currentUser?.isVip)
    ),
    distinctUntilChanged(),
  );
}
