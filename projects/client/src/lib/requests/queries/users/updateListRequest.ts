import { api, type ApiParams } from '$lib/requests/api.ts';
import type { ListPrivacy } from '../../models/ListPrivacy.ts';

type UpdateListRequest = {
  userId: string;
  listId: string;
  name: string;
  description?: string;
  privacy: ListPrivacy;
} & ApiParams;

export function updateListRequest(
  { userId, listId, name, fetch, description, privacy }: UpdateListRequest,
): Promise<boolean> {
  return api({ fetch })
    .users
    .lists
    .list
    .update({
      params: {
        id: userId,
        list_id: listId,
      },
      body: {
        name,
        description,
        privacy,
      },
    })
    .then(({ status }) => status === 200);
}
