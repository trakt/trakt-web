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

export type CreateApiApplicationResult =
  | { ok: true; application?: ApiApplication }
  | { ok: false };

/**
 * Registers a new OAuth application for the authenticated user. Resolves to the
 * created {@link ApiApplication} (including its client id/secret) on success.
 */
export async function createApiApplicationRequest(
  {
    fetch,
    name,
    description,
    redirectUris,
    origins,
  }: CreateApiApplicationParams,
): Promise<CreateApiApplicationResult> {
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
    return { ok: false };
  }

  const parsed = ApiApplicationResponseSchema.safeParse(await response.json());

  return parsed.success
    ? { ok: true, application: mapToApiApplication(parsed.data) }
    : { ok: true };
}
