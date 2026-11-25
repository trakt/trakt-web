import type { OnboardingSetProgress } from './OnboardingSetProgress.ts';

export type OnboardingSelection = {
  readonly active: OnboardingSetProgress | null;
  readonly retiring: ReadonlyArray<string>;
};
