import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { isValidResponse } from '$lib/features/query/_internal/isValidResponse.ts';
import { time } from '$lib/utils/timing/time.ts';

type StartShowRewatchingParams = {
  id: number | string;
} & ApiParams;

export async function startShowRewatchingRequest(
  { fetch, id }: StartShowRewatchingParams,
): Promise<boolean> {
  const resetAt = new Date(Date.now() - time.minutes(1)).toISOString();

  const response = await rawApiFetch({
    fetch,
    path: `/shows/${encodeURIComponent(`${id}`)}/progress/watched/reset`,
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reset_at: resetAt }),
    },
  });

  isValidResponse(response, 'startShowRewatchingRequest');
  return response.ok;
}
