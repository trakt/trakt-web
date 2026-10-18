import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

export async function syncNowMediaSyncConnectionRequest({
  fetch,
  connectionId,
}: { connectionId: number } & ApiParams): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/sync/connections/${connectionId}/sync`,
    init: { method: 'POST' },
  });
  return response.ok;
}
