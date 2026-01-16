import { api, type ApiParams } from '$lib/requests/api.ts';

type LikeListParams = { listId: number } & ApiParams;

export function likeListRequest(
  { fetch, listId }: LikeListParams,
): Promise<boolean> {
  return api({ fetch })
    .lists
    .like({
      params: {
        id: `${listId}`,
      },
    })
    .then(({ status }) => status === 204);
}
