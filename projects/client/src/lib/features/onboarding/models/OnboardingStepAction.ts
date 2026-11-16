export type OnboardingStepAction = {
  readonly text: () => string;
  readonly href: () => string;
};
