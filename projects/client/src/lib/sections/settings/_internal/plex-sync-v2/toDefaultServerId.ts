import type { PlexServerOption } from '$lib/requests/media-sync/plexPinStatusRequest.ts';
import { PLEX_ACCOUNT_SERVER_ID } from './PLEX_ACCOUNT_SERVER_ID.ts';

export function toDefaultServerId(servers: PlexServerOption[]): string | null {
  const reachable = servers.filter((server) =>
    server.reachable && server.id !== PLEX_ACCOUNT_SERVER_ID
  );
  const [only, ...others] = reachable;
  return only && others.length === 0 ? only.id : null;
}
