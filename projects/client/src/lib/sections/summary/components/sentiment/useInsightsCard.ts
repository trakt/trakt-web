import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';

export function useInsightsCard() {
  const { user } = useUser();
  const { isEnabled } = useFeatureFlag();

  const isInsightsCard = combineLatest([
    user,
    isEnabled(FeatureFlag.InsightsCard),
  ]).pipe(
    map(([$user, $isEnabled]) => $isEnabled && ($user?.isDirector ?? false)),
    distinctUntilChanged(),
  );

  return { isInsightsCard };
}
