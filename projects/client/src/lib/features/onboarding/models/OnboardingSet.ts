import type { OnboardingEligibilityContext } from './OnboardingEligibilityContext.ts';
import type { OnboardingRetireContext } from './OnboardingRetireContext.ts';
import type { OnboardingStep } from './OnboardingStep.ts';

export type OnboardingSet<StepId extends string = string> = {
  readonly id: string;
  readonly title: () => string;
  readonly subtitle: () => string;
  readonly unlocksAfter: string | null;
  readonly steps: ReadonlyArray<OnboardingStep<StepId>>;
  readonly eligibleWhen: (context: OnboardingEligibilityContext) => boolean;
  readonly retireWhen: (context: OnboardingRetireContext<StepId>) => boolean;
};
