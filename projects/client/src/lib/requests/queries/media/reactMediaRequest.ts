import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { MediaReaction } from '$lib/requests/models/MediaReaction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { isValidResponse } from '$lib/features/query/_internal/isValidResponse.ts';
import { toMediaReactionsPath } from '$lib/requests/_internal/toMediaReactionsPath.ts';

type ReactMediaParams = {
  type: MediaType;
  slug: string;
  reaction: MediaReaction;
} & ApiParams;

export async function reactMediaRequest(
  { fetch, type, slug, reaction }: ReactMediaParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `${toMediaReactionsPath(type, slug)}/${reaction}`,
    init: { method: 'PUT' },
  });

  if (!isValidResponse(response, 'reactMediaRequest')) {
    return false;
  }

  return response.ok;
}
