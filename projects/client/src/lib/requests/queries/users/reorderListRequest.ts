import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type ReorderListParams = {
  userId: string | number;
  listId: string | number;
  rank: number[];
} & ApiParams;

export async function reorderListRequest(
  { fetch, userId, listId, rank }: ReorderListParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/users/${encodeURIComponent(`${userId}`)}/lists/${
      encodeURIComponent(`${listId}`)
    }/items/reorder`,
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rank }),
    },
  });

  return response.status === 200;
}
