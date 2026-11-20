import type { Component } from 'svelte';
import type { OnboardingStepAction } from './OnboardingStepAction.ts';
import type { OnboardingStepCompletion } from './OnboardingStepCompletion.ts';

export type OnboardingStep<StepId extends string = string> = {
  readonly id: StepId;
  readonly title: () => string;
  readonly hint: () => string;
  readonly icon: Component;
  readonly objective: (() => string) | null;
  readonly action: OnboardingStepAction | null;
  readonly completesWith: OnboardingStepCompletion;
  readonly skippable: boolean;
};
