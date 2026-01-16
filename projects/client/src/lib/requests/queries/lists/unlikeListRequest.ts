import { api, type ApiParams } from '$lib/requests/api.ts';

type UnlikeListParams = { listId: number } & ApiParams;

export function unlikeListRequest(
  { fetch, listId }: UnlikeListParams,
): Promise<boolean> {
  return api({ fetch })
    .lists
    .unlike({
      params: {
        id: `${listId}`,
      },
    })
    .then(({ status }) => status === 204);
}
