import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { EmailCategory } from '$lib/requests/models/EmailCategory.ts';

type SaveEmailSettingsParams = {
  category: EmailCategory;
  enabled: boolean;
} & ApiParams;

export async function saveEmailSettingsRequest(
  { category, enabled, fetch }: SaveEmailSettingsParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: '/users/settings/emails',
    init: {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [category]: enabled }),
    },
  });

  return response.ok;
}
