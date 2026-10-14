import type { PlexConnectStep } from './models/PlexConnectStep.ts';

export function toConnectSteps(
  { hasProfiles, hasHistory = false, isAccountOnly = false }: {
    hasProfiles: boolean;
    hasHistory?: boolean;
    isAccountOnly?: boolean;
  },
): PlexConnectStep[] {
  const steps: PlexConnectStep[] = hasProfiles && !isAccountOnly
    ? ['sign-in', 'server', 'profile', 'sync']
    : ['sign-in', 'server', 'sync'];

  return hasHistory ? [...steps, 'history'] : steps;
}
