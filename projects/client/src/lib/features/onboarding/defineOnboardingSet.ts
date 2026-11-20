import type { OnboardingEligibilityContext } from './models/OnboardingEligibilityContext.ts';
import type { OnboardingRetireContext } from './models/OnboardingRetireContext.ts';
import type { OnboardingSet } from './models/OnboardingSet.ts';
import type { OnboardingStep } from './models/OnboardingStep.ts';

type DefineOnboardingSetParams<StepId extends string> = {
  id: string;
  title: () => string;
  subtitle: () => string;
  unlocksAfter?: string;
  steps: ReadonlyArray<OnboardingStep<StepId>>;
  eligibleWhen?: (context: OnboardingEligibilityContext) => boolean;
  retireWhen?: (context: OnboardingRetireContext<NoInfer<StepId>>) => boolean;
};

export function defineOnboardingSet<const StepId extends string>({
  unlocksAfter,
  eligibleWhen,
  retireWhen,
  ...set
}: DefineOnboardingSetParams<StepId>): OnboardingSet<StepId> {
  return {
    ...set,
    unlocksAfter: unlocksAfter ?? null,
    eligibleWhen: eligibleWhen ?? (() => true),
    retireWhen: retireWhen ?? (() => false),
  };
}
