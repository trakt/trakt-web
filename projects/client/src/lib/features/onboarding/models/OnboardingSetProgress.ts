import type { OnboardingResolvedStep } from './OnboardingResolvedStep.ts';
import type { OnboardingSet } from './OnboardingSet.ts';
import type { OnboardingSetRecord } from './OnboardingSetRecord.ts';

export type OnboardingSetProgress = {
  readonly set: OnboardingSet;
  readonly record: OnboardingSetRecord | null;
  readonly steps: ReadonlyArray<OnboardingResolvedStep>;
  readonly done: number;
  readonly skipped: number;
  readonly total: number;
  readonly remaining: number;
  readonly isClosed: boolean;
  readonly isEarned: boolean;
};
