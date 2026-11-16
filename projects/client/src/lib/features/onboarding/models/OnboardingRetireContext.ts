export type OnboardingRetireContext<StepId extends string = string> = {
  readonly count: (stepId: StepId) => number;
  readonly isDoneByAction: (stepId: StepId) => boolean;
};
