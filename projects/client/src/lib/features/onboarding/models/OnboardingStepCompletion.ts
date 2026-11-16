import type { OnboardingMutationKey } from './OnboardingMutationKey.ts';
import type { OnboardingSignalId } from './OnboardingSignalId.ts';

export type OnboardingStepCompletion =
  | 'always'
  | {
      readonly signal: OnboardingSignalId;
      readonly mutations: ReadonlyArray<OnboardingMutationKey>;
      readonly atLeast?: number;
    };
