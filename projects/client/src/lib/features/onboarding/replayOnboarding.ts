import { onboardingReplayRequests } from './_internal/onboardingReplayRequests.ts';

/**
 * Development aid: restarts every set of the current account from the
 * account's current counts, so a member with history can walk the steps
 * again. Not wired to any product surface; the devtools spotlight action
 * calls it.
 */
export function replayOnboarding() {
  onboardingReplayRequests.next();
}
