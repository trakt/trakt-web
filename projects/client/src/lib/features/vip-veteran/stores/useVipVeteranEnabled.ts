import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';

export function useVipVeteranEnabled() {
  const { isEnabled } = useFeatureFlag();
  return isEnabled(FeatureFlag.VipVeteran);
}
