import { api, type ApiParams } from '$lib/requests/api.ts';
import type { HiddenMediaRequest } from '@trakt/api';

type RestoreShowRequest = {
  body: HiddenMediaRequest;
} & ApiParams;

export async function hideShowCalendarRequest(
  { body, fetch }: RestoreShowRequest,
): Promise<boolean> {
  const { status } = await api({ fetch })
    .users
    .hidden
    .add({
      params: {
        section: 'calendar',
      },
      body,
    });

  return status === 200;
}
