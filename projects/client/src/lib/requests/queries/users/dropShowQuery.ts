import { api, type ApiParams } from '$lib/requests/api.ts';
import type { HiddenAddRequest } from '@trakt/api';

type DropShowRequest = {
  body: HiddenAddRequest;
} & ApiParams;

export function dropShowRequest(
  { body, fetch }: DropShowRequest,
): Promise<boolean> {
  return api({ fetch })
    .users
    .hidden
    .add({
      params: {
        section: 'dropped',
      },
      body,
    })
    .then(({ status }) => status === 200);
}
