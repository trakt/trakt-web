import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type UpdateApiApplicationParams = {
  id: number;
  name: string;
  description?: string;
  redirectUris: ReadonlyArray<string>;
  origins: ReadonlyArray<string>;
} & ApiParams;

/**
 * Updates the editable fields of an OAuth application the user owns. Resolves
 * to `true` when the update succeeds (HTTP 2xx). Credentials (`client_id`,
 * `client_secret`) and the approval state are never changed by this request.
 */
export async function updateApiApplicationRequest(
  {
    fetch,
    id,
    name,
    description,
    redirectUris,
    origins,
  }: UpdateApiApplicationParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/applications/${id}`,
    init: {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name,
        description: description || undefined,
        redirect_uri: redirectUris,
        origins,
      }),
    },
  });

  return response.ok;
}
