import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type RevokeConnectedAppParams = {
  id: number;
} & ApiParams;

/**
 * Revokes a connected third-party app's access to the authenticated user's
 * account. Resolves to `true` when the revocation succeeds (HTTP 2xx).
 */
export async function revokeConnectedAppRequest(
  { fetch, id }: RevokeConnectedAppParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/connected-apps/${id}`,
    init: {
      method: 'DELETE',
    },
  });

  return response.ok;
}
