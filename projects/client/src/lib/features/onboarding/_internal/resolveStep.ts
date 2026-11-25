import type { OnboardingSetRecord } from '$lib/features/onboarding/models/OnboardingSetRecord.ts';
import type { OnboardingSignalCounts } from '$lib/features/onboarding/models/OnboardingSignalCounts.ts';
import type { OnboardingStep } from '$lib/features/onboarding/models/OnboardingStep.ts';
import type { OnboardingStepStatus } from '$lib/features/onboarding/models/OnboardingStepStatus.ts';

type ResolveStepParams = {
  step: OnboardingStep;
  record: OnboardingSetRecord | null;
  counts: OnboardingSignalCounts;
};

function isCompletedByAccount({
  step,
  counts,
}: Omit<ResolveStepParams, 'record'>): boolean {
  if (step.completesWith === 'always') return true;

  const { signal, atLeast = 1 } = step.completesWith;
  return (counts[signal] ?? 0) >= atLeast;
}

export function resolveStep({
  step,
  record,
  counts,
}: ResolveStepParams): OnboardingStepStatus {
  const stored = record?.steps[step.id]?.status;

  if (stored === 'done') return 'done';
  if (isCompletedByAccount({ step, counts })) return 'done';
  if (stored === 'skipped') return 'skipped';
  return 'todo';
}
