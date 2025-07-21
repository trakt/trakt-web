import { api, type ApiParams } from '$lib/requests/api.ts';
import type { CreateListRequest } from '@trakt/api';

type CreateListRequestParams =
  & {
    userId: string;
  }
  & CreateListRequest
  & ApiParams;

export function createListRequest(
  { userId, name, fetch }: CreateListRequestParams,
): Promise<boolean> {
  return api({ fetch })
    .users
    .lists
    .create({
      params: {
        id: userId,
      },
      body: {
        name,
      },
    })
    .then(({ status }) => status === 201);
}
