import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { SyncItemSchema } from '$lib/requests/models/SyncItem.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToSyncItem } from './_internal/mapToSyncItem.ts';

type SyncSkippedItemsParams = { id: number } & PaginationParams & ApiParams;

const syncSkippedItemsRequest = (
  { fetch, id, limit, page }: SyncSkippedItemsParams,
) =>
  api({ fetch })
    .users
    .syncs
    .skipped({
      params: { id },
      query: { page, limit },
    });

export const syncSkippedItemsQuery = defineInfiniteQuery({
  key: 'syncSkippedItems',
  invalidations: [],
  dependencies: (params) => [params.id, params.limit, params.page],
  request: syncSkippedItemsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToSyncItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(SyncItemSchema),
  ttl: time.minutes(30),
  enabled: (params) => Number.isFinite(params.id),
});
