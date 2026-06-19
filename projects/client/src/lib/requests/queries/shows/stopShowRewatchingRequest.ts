import { isValidResponse } from '$lib/features/query/_internal/isValidResponse.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type StopShowRewatchingParams = {
  id: number | string;
} & ApiParams;

export async function stopShowRewatchingRequest(
  { fetch, id }: StopShowRewatchingParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/shows/${encodeURIComponent(`${id}`)}/progress/watched/reset`,
    init: {
      method: 'DELETE',
    },
  });

  isValidResponse(response, 'stopShowRewatchingRequest');
  return response.ok;
}
