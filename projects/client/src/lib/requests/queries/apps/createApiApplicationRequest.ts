import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { ApiApplication } from '$lib/requests/models/ApiApplication.ts';
import { ApiApplicationResponseSchema } from './_internal/ApiApplicationResponse.ts';
import { mapToApiApplication } from './_internal/mapToApiApplication.ts';

type CreateApiApplicationParams = {
  name: string;
  description?: string;
  redirectUris: ReadonlyArray<string>;
  origins: ReadonlyArray<string>;
} & ApiParams;

/**
 * Registers a new OAuth application for the authenticated user. Resolves to the
 * created {@link ApiApplication} (including its client id/secret) on success, or
 * `null` when the request fails.
 */
export async function createApiApplicationRequest(
  {
    fetch,
    name,
    description,
    redirectUris,
    origins,
  }: CreateApiApplicationParams,
): Promise<ApiApplication | null> {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/users/me/applications',
    init: {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name,
        description: description || undefined,
        redirect_uri: redirectUris,
        origins,
      }),
    },
  });

  if (!response.ok) {
    return null;
  }

  return mapToApiApplication(
    ApiApplicationResponseSchema.parse(await response.json()),
  );
}
