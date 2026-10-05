import type { PlexServerOption } from '$lib/requests/media-sync/plexPinStatusRequest.ts';

export function toDefaultServerId(servers: PlexServerOption[]): string | null {
  const reachable = servers.filter((server) => server.reachable);
  const [only, ...others] = reachable;
  return only && others.length === 0 ? only.id : null;
}
