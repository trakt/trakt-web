import type { OnboardingSet } from '$lib/features/onboarding/models/OnboardingSet.ts';
import type { OnboardingSetProgress } from '$lib/features/onboarding/models/OnboardingSetProgress.ts';
import type { OnboardingSetRecord } from '$lib/features/onboarding/models/OnboardingSetRecord.ts';
import type { OnboardingSignalCounts } from '$lib/features/onboarding/models/OnboardingSignalCounts.ts';
import { resolveStep } from './resolveStep.ts';

type ResolveSetParams = {
  set: OnboardingSet;
  record: OnboardingSetRecord | null;
  counts: OnboardingSignalCounts;
};

export function resolveSet({
  set,
  record,
  counts,
}: ResolveSetParams): OnboardingSetProgress {
  const steps = set.steps.map((step) => ({
    step,
    status: resolveStep({ step, record, counts }),
  }));
  const done = steps.filter(({ status }) => status === 'done').length;
  const skipped = steps.filter(({ status }) => status === 'skipped').length;
  const total = steps.length;

  return {
    set,
    record,
    steps,
    done,
    skipped,
    total,
    remaining: total - done - skipped,
    isClosed: done + skipped === total,
    isEarned: done === total,
  };
}
