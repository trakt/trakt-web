import { api, type ApiParams } from '$lib/requests/api.ts';
import type { SmartListWriteRequest } from '@trakt/api';

type CreateSmartListRequestParams =
  & {
    body: SmartListWriteRequest;
  }
  & ApiParams;

export function createSmartListRequest(
  { body, fetch }: CreateSmartListRequestParams,
): Promise<boolean> {
  return api({ fetch })
    .users
    .smartLists
    .create({
      params: {
        id: 'me',
      },
      body,
    })
    .then(({ status }) => status === 201);
}
