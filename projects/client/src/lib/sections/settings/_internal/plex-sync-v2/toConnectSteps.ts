import type { PlexConnectStep } from './models/PlexConnectStep.ts';

export function toConnectSteps(
  { hasProfiles, isAccountOnly = false }: {
    hasProfiles: boolean;
    isAccountOnly?: boolean;
  },
): PlexConnectStep[] {
  return hasProfiles && !isAccountOnly
    ? ['sign-in', 'server', 'profile', 'sync']
    : ['sign-in', 'server', 'sync'];
}
