import { api, type ApiParams } from '$lib/requests/api.ts';

export function plexRevokeRequest({ fetch }: ApiParams = {}): Promise<boolean> {
  return api({ fetch }).users.plex.disconnect()
    .then(({ status }) => status === 204);
}
