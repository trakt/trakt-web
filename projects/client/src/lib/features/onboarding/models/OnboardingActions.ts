type StepTarget = { setId: string; stepId: string };
type SetTarget = { setId: string };

export type OnboardingActions = {
  readonly skip: (target: StepTarget) => void;
  readonly unskip: (target: StepTarget) => void;
  readonly track: (target: StepTarget) => void;
  readonly untrack: (target: SetTarget & { stepId: string | null }) => void;
  readonly clearTracked: (target: SetTarget) => void;
  readonly dismiss: (target: SetTarget) => void;
};
