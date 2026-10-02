import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { isValidResponse } from '$lib/features/query/_internal/isValidResponse.ts';
import { toMediaReactionsPath } from '$lib/requests/_internal/toMediaReactionsPath.ts';

type RemoveMediaReactionsParams = {
  type: MediaType;
  slug: string;
  ids: ReadonlyArray<number>;
} & ApiParams;

export async function removeMediaReactionsRequest(
  { fetch, type, slug, ids }: RemoveMediaReactionsParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `${toMediaReactionsPath(type, slug)}/${ids.join(',')}`,
    init: { method: 'DELETE' },
  });

  if (!isValidResponse(response, 'removeMediaReactionsRequest')) {
    return false;
  }

  return response.ok;
}
