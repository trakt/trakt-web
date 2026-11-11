import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { WatchlistRequest } from '@trakt/api';

type AddToListParams = {
  body: WatchlistRequest;
  listId: string | number;
  userId?: string | number | Nil;
} & ApiParams;

export type AddToListResult =
  | { status: 'added' | 'failed' }
  | { status: 'list-full' | 'lists-full'; limit: number; isVip: boolean };

const LIMIT_STATUS_BY_ERROR = {
  list_item_limit_reached: 'list-full',
  total_list_item_limit_reached: 'lists-full',
} as const;

async function toLimitResult(response: Response): Promise<AddToListResult> {
  const payload: unknown = await response.json().catch(() => null);
  const error =
    payload != null && typeof payload === 'object' && 'error' in payload
      ? payload.error
      : null;
  const limit = Number(response.headers.get('X-Account-Limit'));

  if (typeof error !== 'string' || !Number.isFinite(limit) || limit <= 0) {
    return { status: 'failed' };
  }

  const status =
    LIMIT_STATUS_BY_ERROR[error as keyof typeof LIMIT_STATUS_BY_ERROR];

  return status == null
    ? { status: 'failed' }
    : {
        status,
        limit,
        isVip: response.headers.get('X-VIP-User') === 'true',
      };
}

export async function addToListRequest({
  body,
  fetch,
  listId,
  userId,
}: AddToListParams): Promise<AddToListResult> {
  const response = await rawApiFetch({
    fetch,
    path: `/users/${userId ?? 'me'}/lists/${listId}/items`,
    init: {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
  });

  if (response.status === 201) return { status: 'added' };
  if (response.status === 420) return toLimitResult(response);

  return { status: 'failed' };
}
