import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

export async function retryMediaSyncConnectionRequest(
  { fetch, connectionId }: { connectionId: number } & ApiParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/sync/connections/${connectionId}/retry`,
    init: { method: 'POST' },
  });
  return response.ok;
}
