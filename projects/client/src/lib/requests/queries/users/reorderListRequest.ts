import type { ApiParams } from '$lib/requests/api.ts';
import { postReorderRequest } from './_internal/postReorderRequest.ts';

type ReorderListParams = {
  userId: string | number;
  listId: string | number;
  rank: number[];
} & ApiParams;

export function reorderListRequest(
  { fetch, userId, listId, rank }: ReorderListParams,
): Promise<boolean> {
  return postReorderRequest({
    fetch,
    path: `/users/${encodeURIComponent(`${userId}`)}/lists/${
      encodeURIComponent(`${listId}`)
    }/items/reorder`,
    rank,
  });
}
