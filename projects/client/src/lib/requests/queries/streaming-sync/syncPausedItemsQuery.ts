import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { SyncItemSchema } from '$lib/requests/models/SyncItem.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToSyncItem } from './_internal/mapToSyncItem.ts';

type SyncPausedItemsParams = { id: number } & PaginationParams & ApiParams;

const syncPausedItemsRequest = (
  { fetch, id, limit, page }: SyncPausedItemsParams,
) =>
  api({ fetch })
    .users
    .syncs
    .paused({
      params: { id },
      query: { page, limit },
    });

export const syncPausedItemsQuery = defineInfiniteQuery({
  key: 'syncPausedItems',
  invalidations: [],
  dependencies: (params) => [params.id, params.limit, params.page],
  request: syncPausedItemsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToSyncItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(SyncItemSchema),
  ttl: time.minutes(30),
  enabled: (params) => Number.isFinite(params.id),
});
