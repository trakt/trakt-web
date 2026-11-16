import type { OnboardingSetRecord } from '$lib/features/onboarding/models/OnboardingSetRecord.ts';
import type { OnboardingStepRecord } from '$lib/features/onboarding/models/OnboardingStepRecord.ts';

type Tracked = OnboardingSetRecord['tracked'];

function earliest(a: number | Nil, b: number | Nil): number | Nil {
  if (a == null) return b;
  if (b == null) return a;
  return Math.min(a, b);
}

function newerTracked(local: Tracked, remote: Tracked): Tracked {
  if (!local) return remote;
  if (!remote) return local;
  return local.at > remote.at ? local : remote;
}

function mergeStep(
  local: OnboardingStepRecord | undefined,
  remote: OnboardingStepRecord | undefined,
): OnboardingStepRecord | undefined {
  if (!local) return remote;
  if (!remote) return local;
  if (local.status === 'done' && remote.status !== 'done') return local;
  if (remote.status === 'done' && local.status !== 'done') return remote;
  return local.at > remote.at ? local : remote;
}

export function mergeOnboardingSet(
  local: OnboardingSetRecord,
  remote: OnboardingSetRecord,
): OnboardingSetRecord {
  const stepIds = new Set([
    ...Object.keys(remote.steps),
    ...Object.keys(local.steps),
  ]);

  const steps = Object.fromEntries(
    Array.from(stepIds).flatMap((stepId) => {
      const merged = mergeStep(local.steps[stepId], remote.steps[stepId]);
      return merged ? [[stepId, merged]] : [];
    }),
  );

  return {
    startedAt: Math.min(local.startedAt, remote.startedAt),
    completedAt: earliest(local.completedAt, remote.completedAt),
    retiredAt: earliest(local.retiredAt, remote.retiredAt),
    tracked: newerTracked(local.tracked, remote.tracked),
    steps,
  };
}
