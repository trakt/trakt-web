import type { OnboardingSetRecord } from '$lib/features/onboarding/models/OnboardingSetRecord.ts';

type IsSetFoldedParams = {
  record: Pick<OnboardingSetRecord, 'completedAt'> | null;
  loadedAt: number;
};

export function isSetFolded({ record, loadedAt }: IsSetFoldedParams): boolean {
  if (record?.completedAt == null) return false;
  return record.completedAt < loadedAt;
}
