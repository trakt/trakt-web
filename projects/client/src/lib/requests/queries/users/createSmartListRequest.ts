import { api, type ApiParams } from '$lib/requests/api.ts';
import type { SmartListWriteRequest } from '@trakt/api';

type CreateSmartListRequestParams =
  & {
    body: SmartListWriteRequest;
  }
  & ApiParams;

export function createSmartListRequest(
  { body, fetch }: CreateSmartListRequestParams,
): Promise<string | Nil> {
  return api({ fetch })
    .users
    .smartLists
    .create({
      params: {
        id: 'me',
      },
      body,
    })
    .then((response) => {
      if (response.status !== 201) {
        return null;
      }

      return response.body.ids.slug;
    });
}
