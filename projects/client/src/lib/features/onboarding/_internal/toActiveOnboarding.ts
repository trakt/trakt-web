import type { ActiveOnboarding } from '$lib/features/onboarding/models/ActiveOnboarding.ts';
import type { OnboardingActions } from '$lib/features/onboarding/models/OnboardingActions.ts';
import type { OnboardingSetProgress } from '$lib/features/onboarding/models/OnboardingSetProgress.ts';

type ToActiveOnboardingParams = {
  progress: OnboardingSetProgress;
  actions: OnboardingActions;
};

export function toActiveOnboarding({
  progress,
  actions,
}: ToActiveOnboardingParams): ActiveOnboarding {
  const setId = progress.set.id;
  const trackedStepId = progress.record?.tracked?.stepId ?? null;

  return {
    progress,
    trackedStepId,
    skip: (stepId) => actions.skip({ setId, stepId }),
    unskip: (stepId) => actions.unskip({ setId, stepId }),
    track: (stepId) => actions.track({ setId, stepId }),
    untrack: () => actions.untrack({ setId, stepId: trackedStepId }),
    clearTracked: () => actions.clearTracked({ setId }),
    dismiss: () => actions.dismiss({ setId }),
  };
}
