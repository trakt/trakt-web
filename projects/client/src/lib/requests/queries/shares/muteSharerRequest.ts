import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type MuteSharerParams = { sharerId: number } & ApiParams;

export async function muteSharerRequest(
  { fetch, sharerId }: MuteSharerParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/shares/mutes',
    init: {
      method: 'POST',
      body: JSON.stringify({ sharer_id: sharerId }),
      headers: { 'content-type': 'application/json' },
    },
  });

  return response.ok;
}
