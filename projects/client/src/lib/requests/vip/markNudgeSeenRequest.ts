import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

export async function markNudgeSeenRequest({
  fetch,
}: ApiParams = {}): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/users/me/nudge/seen',
    init: { method: 'POST' },
  });

  return response.ok;
}
