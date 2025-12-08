import { api, type ApiParams } from '$lib/requests/api.ts';
import type { CreateListRequest } from '@trakt/api';
import type { ListPrivacy } from '../../models/ListPrivacy.ts';

type CreateListRequestParams =
  & {
    userId: string;
    description?: string;
    privacy: ListPrivacy;
  }
  & CreateListRequest
  & ApiParams;

export function createListRequest(
  { userId, name, fetch, description, privacy }: CreateListRequestParams,
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
        description,
        privacy,
      },
    })
    .then(({ status }) => status === 201);
}
