import { api, type ApiParams } from '$lib/requests/api.ts';
import type { SettingsRequest } from '@trakt/api';

type SaveSettingsRequest = {
  body: SettingsRequest;
} & ApiParams;

export async function saveSettingsRequest(
  { body, fetch }: SaveSettingsRequest,
): Promise<boolean> {
  const { status } = await api({ fetch })
    .users
    .saveSettings({
      body,
    });

  return status >= 200 && status < 300;
}
