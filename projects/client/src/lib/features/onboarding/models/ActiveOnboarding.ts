import type { OnboardingSetProgress } from '$lib/features/onboarding/models/OnboardingSetProgress.ts';

export type ActiveOnboarding = {
  readonly progress: OnboardingSetProgress;
  readonly trackedStepId: string | null;
  readonly skip: (stepId: string) => void;
  readonly unskip: (stepId: string) => void;
  readonly dismiss: () => void;
  readonly track: (stepId: string) => void;
  readonly untrack: () => void;
  readonly clearTracked: () => void;
};
