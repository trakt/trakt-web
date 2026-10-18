import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToSmartListItem } from '$lib/requests/_internal/mapToSmartListItem.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { SmartListItemSchema } from '$lib/requests/models/SmartListItem.ts';
import { SmartListItemResponseSchema } from '$lib/requests/models/SmartListItemResponse.ts';
import { time } from '$lib/utils/timing/time.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';

type SmartListDraftItemsParams = { listId: string } & PaginationParams &
  ApiParams;

const smartListDraftItemsRequest = async ({
  fetch,
  listId,
  limit,
  page,
}: SmartListDraftItemsParams) => {
  const response = await rawApiFetch({
    fetch,
    path: `/users/me/lists/${listId}/smart-list-draft/items${buildParamString({
      extended: 'full,images,colors',
      page,
      limit,
    })}`,
  });

  if (!response.ok) {
    throw new Error(`Smart list draft items failed (${response.status})`);
  }

  return {
    body: SmartListItemResponseSchema.array().parse(await response.json()),
    headers: response.headers,
    status: 200 as const,
  };
};

export const smartListDraftItemsQuery = defineInfiniteQuery({
  key: 'smartListDraftItems',
  invalidations: [
    InvalidateAction.List.Edited,
    InvalidateAction.SmartList.Created,
  ],
  dependencies: (params: SmartListDraftItemsParams) => [
    params.listId,
    params.page,
    params.limit,
  ],
  request: smartListDraftItemsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToSmartListItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(SmartListItemSchema),
  ttl: time.minutes(5),
});
