import { api, type ApiParams } from '$lib/requests/api.ts';

type DeleteListRequest = {
  userId: string;
  listId: string;
} & ApiParams;

export function deleteListRequest(
  { userId, listId, fetch }: DeleteListRequest,
): Promise<boolean> {
  return api({ fetch })
    .users
    .lists
    .list
    .delete({
      params: {
        id: userId,
        list_id: listId,
      },
    })
    .then(({ status }) => status === 204);
}
