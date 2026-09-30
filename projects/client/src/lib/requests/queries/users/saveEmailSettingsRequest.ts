import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { EmailSettingsResponse } from '$lib/requests/models/EmailSettingsResponse.ts';

type SaveEmailSettingsParams = {
  body: Partial<EmailSettingsResponse>;
} & ApiParams;

export async function saveEmailSettingsRequest(
  { body, fetch }: SaveEmailSettingsParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: '/users/settings/emails',
    init: {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  });

  return response.ok;
}
