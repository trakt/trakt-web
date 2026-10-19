import type { MediaSyncConnection } from '$lib/requests/media-sync/models/MediaSyncConnection.ts';
import type { PlexConnectStep } from './models/PlexConnectStep.ts';

function toProviderSteps({
  provider,
  hasProfiles,
  isAccountOnly,
}: {
  provider: MediaSyncConnection['provider'];
  hasProfiles: boolean;
  isAccountOnly: boolean;
}): PlexConnectStep[] {
  if (provider === 'jellyfin') return ['sign-in', 'sync'];

  return hasProfiles && !isAccountOnly
    ? ['sign-in', 'server', 'profile', 'sync']
    : ['sign-in', 'server', 'sync'];
}

export function toConnectSteps({
  provider = 'plex',
  hasProfiles,
  hasHistory = false,
  isAccountOnly = false,
  isWebhookOnly = false,
}: {
  provider?: MediaSyncConnection['provider'];
  hasProfiles: boolean;
  hasHistory?: boolean;
  isAccountOnly?: boolean;
  isWebhookOnly?: boolean;
}): PlexConnectStep[] {
  if (isWebhookOnly) return ['sign-in', 'server'];

  const steps = toProviderSteps({ provider, hasProfiles, isAccountOnly });

  return hasHistory ? [...steps, 'history'] : steps;
}
