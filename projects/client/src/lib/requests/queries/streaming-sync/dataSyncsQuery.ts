import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { DataSyncSchema } from '$lib/requests/models/DataSync.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToDataSync } from './_internal/mapToDataSync.ts';

type DataSyncsParams = PaginationParams & ApiParams;

const dataSyncsRequest = (
  { fetch, limit, page }: DataSyncsParams,
) =>
  api({ fetch })
    .users
    .syncs
    .listByType({
      params: { type: 'younify' },
      query: { page, limit },
    });

export const dataSyncsQuery = defineInfiniteQuery({
  key: 'dataSyncs',
  invalidations: [InvalidateAction.StreamingSync.Sync],
  dependencies: (params) => [params.limit, params.page],
  request: dataSyncsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToDataSync),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(DataSyncSchema),
  ttl: time.minutes(15),
});
