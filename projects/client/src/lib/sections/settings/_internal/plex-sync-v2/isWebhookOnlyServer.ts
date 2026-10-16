import type { PlexServerOption } from '$lib/requests/media-sync/plexPinStatusRequest.ts';
import { PLEX_ACCOUNT_SERVER_ID } from './PLEX_ACCOUNT_SERVER_ID.ts';

export function isWebhookOnlyServer(
  servers: ReadonlyArray<Pick<PlexServerOption, 'id' | 'reachable'>>,
  serverId: string | null,
): boolean {
  if (serverId == null || serverId === PLEX_ACCOUNT_SERVER_ID) return false;
  return servers.find(({ id }) => id === serverId)?.reachable === false;
}
