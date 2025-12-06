import { api, type ApiParams } from '$lib/requests/api.ts';
import type { HiddenMediaRequest } from '@trakt/api';

type DropShowRequest = {
  body: HiddenMediaRequest;
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
    .then(({ status }) => {
      return status === 200;
    });
}
