import type { OnboardingRetireContext } from '$lib/features/onboarding/models/OnboardingRetireContext.ts';

type ImportedAnyParams<StepId extends string> = {
  threshold: number;
  steps: ReadonlyArray<StepId>;
};

export function importedAny<StepId extends string>({
  threshold,
  steps,
}: ImportedAnyParams<StepId>) {
  return ({ count, isDoneByAction }: OnboardingRetireContext<StepId>) =>
    steps.some(
      (stepId) => count(stepId) >= threshold && !isDoneByAction(stepId),
    );
}
