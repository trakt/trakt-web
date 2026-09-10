import { api, type ApiParams } from '$lib/requests/api.ts';
import type { PlexServer } from '@trakt/api';

export type { PlexServer };

export async function plexServersQuery(
  { fetch }: ApiParams = {},
): Promise<PlexServer[]> {
  const response = await api({ fetch }).users.plex.servers();

  if (response.status !== 200) {
    throw new Error(`Failed to load Plex servers: ${response.status}`);
  }

  return response.body.servers;
}
