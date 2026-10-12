import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type SaveClientStateParams = {
  key: string;
  value: unknown;
} & ApiParams;

export async function saveClientStateRequest(
  { key, value, fetch }: SaveClientStateParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/client-state/${encodeURIComponent(key)}`,
    init: {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    },
  });

  return response.ok;
}
