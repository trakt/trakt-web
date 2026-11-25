import type { MutationKey } from '$lib/features/query/models/MutationKey.ts';
import type { OnboardingSignalId } from './OnboardingSignalId.ts';

export type OnboardingStepCompletion =
  | 'always'
  | {
      readonly signal: OnboardingSignalId;
      readonly mutations: ReadonlyArray<MutationKey>;
      readonly atLeast?: number;
    };
