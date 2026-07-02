import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type ReorderUserListsParams = {
  userId: string | number;
  rank: number[];
} & ApiParams;

export async function reorderUserListsRequest(
  { fetch, userId, rank }: ReorderUserListsParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/users/${encodeURIComponent(`${userId}`)}/lists/reorder`,
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
