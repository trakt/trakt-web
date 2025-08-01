import { api, type ApiParams } from '$lib/requests/api.ts';

type UpdateListRequest = {
  userId: string;
  listId: string;
  name: string;
} & ApiParams;

export function updateListRequest(
  { userId, listId, name, fetch }: UpdateListRequest,
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
      },
    })
    .then(({ status }) => status === 200);
}
