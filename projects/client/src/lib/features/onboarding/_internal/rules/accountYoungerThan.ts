import { time } from '$lib/utils/timing/time.ts';
import type { OnboardingEligibilityContext } from '$lib/features/onboarding/models/OnboardingEligibilityContext.ts';

export function accountYoungerThan({ days }: { days: number }) {
  const maxAge = time.days(days);

  return ({ user, startedAt, now }: OnboardingEligibilityContext): boolean => {
    const { joinedAt } = user;
    if (!joinedAt) return false;
    if (Number.isNaN(joinedAt.getTime())) return false;

    return (startedAt ?? now) - joinedAt.getTime() < maxAge;
  };
}
