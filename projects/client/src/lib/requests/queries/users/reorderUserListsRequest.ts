import type { ApiParams } from '$lib/requests/api.ts';
import { postReorderRequest } from './_internal/postReorderRequest.ts';

type ReorderUserListsParams = {
  userId: string | number;
  rank: number[];
} & ApiParams;

export function reorderUserListsRequest(
  { fetch, userId, rank }: ReorderUserListsParams,
): Promise<boolean> {
  return postReorderRequest({
    fetch,
    path: `/users/${encodeURIComponent(`${userId}`)}/lists/reorder`,
    rank,
  });
}
