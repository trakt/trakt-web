import { api, type ApiParams } from '$lib/requests/api.ts';
import { z } from 'zod';

export const PlexServerSchema = z.object({
  id: z.string(),
  name: z.string(),
  owned: z.boolean(),
});

export type PlexServer = z.infer<typeof PlexServerSchema>;

export async function plexServersQuery(
  { fetch }: ApiParams = {},
): Promise<PlexServer[] | null> {
  const response = await api({ fetch }).users.plex.servers();

  if (response.status !== 200) return null;
  return response.body.servers.map(({ id, name, owned }) => ({ id, name, owned }));
}
