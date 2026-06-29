import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type DeleteApiApplicationParams = {
  id: number;
} & ApiParams;

/**
 * Deletes an OAuth application the user owns, along with every credential
 * issued for it. Resolves to `true` when the deletion succeeds (HTTP 2xx).
 */
export async function deleteApiApplicationRequest(
  { fetch, id }: DeleteApiApplicationParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/applications/${id}`,
    init: {
      method: 'DELETE',
    },
  });

  return response.ok;
}
