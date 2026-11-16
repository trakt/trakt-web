import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';

export type OnboardingEligibilityContext = {
  readonly user: UserSettings;
  readonly startedAt: number | Nil;
  readonly now: number;
};
