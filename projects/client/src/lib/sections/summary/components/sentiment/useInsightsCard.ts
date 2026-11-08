import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';

export function useInsightsCard() {
  const { isEnabled } = useFeatureFlag();

  return { isInsightsCard: isEnabled(FeatureFlag.InsightsCard) };
}
