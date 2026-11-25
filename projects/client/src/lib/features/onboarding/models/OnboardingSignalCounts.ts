import type { OnboardingSignalId } from './OnboardingSignalId.ts';

export type OnboardingSignalCounts = Readonly<
  Partial<Record<OnboardingSignalId, number>>
>;
