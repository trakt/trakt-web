import type { OnboardingAccountWrite } from '$lib/features/onboarding/models/OnboardingAccountWrite.ts';
import type { OnboardingSelection } from '$lib/features/onboarding/models/OnboardingSelection.ts';

export function toAccountWrites({
  active,
  retiring,
}: OnboardingSelection): ReadonlyArray<OnboardingAccountWrite> {
  const retires = retiring.map((setId) => ({
    setId,
    change: { type: 'retire' as const },
  }));
  if (!active) return retires;

  const { set, record, steps, isClosed } = active;
  const setId = set.id;

  const start = record ? [] : [{ setId, change: { type: 'start' as const } }];

  const landed = steps
    .filter(
      ({ step, status }) =>
        status === 'done' && record?.steps[step.id]?.status !== 'done',
    )
    .map(({ step }) => ({
      setId,
      change: {
        type: 'done' as const,
        stepId: step.id,
        source: 'account' as const,
      },
    }));

  const complete =
    isClosed && record?.completedAt == null
      ? [{ setId, change: { type: 'complete' as const } }]
      : [];

  return [...start, ...landed, ...complete, ...retires];
}
