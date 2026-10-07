import type { PlexConnectStep } from './models/PlexConnectStep.ts';

export function toConnectSteps(
  { hasProfiles }: { hasProfiles: boolean },
): PlexConnectStep[] {
  return hasProfiles
    ? ['sign-in', 'server', 'profile', 'sync']
    : ['sign-in', 'server', 'sync'];
}
