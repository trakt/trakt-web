import type { OnboardingStep } from '$lib/features/onboarding/models/OnboardingStep.ts';
import type { OnboardingStepStatus } from '$lib/features/onboarding/models/OnboardingStepStatus.ts';

export type OnboardingResolvedStep = {
  readonly step: OnboardingStep;
  readonly status: OnboardingStepStatus;
};
