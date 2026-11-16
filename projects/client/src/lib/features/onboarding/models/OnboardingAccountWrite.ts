import type { OnboardingRecordChange } from './OnboardingRecordChange.ts';

export type OnboardingAccountWrite = {
  readonly setId: string;
  readonly change: OnboardingRecordChange;
};
