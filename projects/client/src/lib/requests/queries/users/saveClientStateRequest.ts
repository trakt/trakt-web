import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type SaveClientStateParams = {
  key: string;
  value: unknown;
  method?: 'PUT' | 'PATCH';
} & ApiParams;

export async function saveClientStateRequest({
  key,
  value,
  method = 'PUT',
  fetch,
}: SaveClientStateParams): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/client-state/${encodeURIComponent(key)}`,
    init: {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    },
  });

  return response.ok;
}
