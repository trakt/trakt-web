import { onboardingReplayRequests } from './_internal/onboardingReplayRequests.ts';

export function replayOnboarding() {
  onboardingReplayRequests.next();
}
