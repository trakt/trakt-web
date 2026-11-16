import type { OnboardingSet } from '$lib/features/onboarding/models/OnboardingSet.ts';
import type { OnboardingStepCompletion } from '$lib/features/onboarding/models/OnboardingStepCompletion.ts';

type BuildOnboardingStep = {
  id: string;
  completesWith?: OnboardingStepCompletion;
  skippable?: boolean;
};

type BuildOnboardingSetParams = Partial<Omit<OnboardingSet, 'steps'>> & {
  steps: ReadonlyArray<BuildOnboardingStep>;
};

export function buildOnboardingSet({
  steps,
  ...set
}: BuildOnboardingSetParams): OnboardingSet {
  return {
    id: 'test',
    title: () => 'Test',
    subtitle: () => '',
    unlocksAfter: null,
    eligibleWhen: () => true,
    retireWhen: () => false,
    ...set,
    steps: steps.map((step) => ({
      title: () => step.id,
      hint: () => '',
      icon: null as never,
      objective: null,
      action: null,
      completesWith: 'always',
      skippable: true,
      ...step,
    })),
  };
}
