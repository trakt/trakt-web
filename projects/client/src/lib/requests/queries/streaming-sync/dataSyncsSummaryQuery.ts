import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { DataSyncSchema } from '$lib/requests/models/DataSync.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { mapToDataSync } from './_internal/mapToDataSync.ts';

const DataSyncsSummarySchema = z.object({
  count: z.number(),
  latest: DataSyncSchema.nullable(),
});

type DataSyncsSummaryParams = ApiParams;

const dataSyncsSummaryRequest = (
  { fetch }: DataSyncsSummaryParams,
) =>
  api({ fetch })
    .users
    .syncs
    .listByType({
      params: { type: 'younify' },
      query: { page: 1, limit: 1 },
    });

export const dataSyncsSummaryQuery = defineQuery({
  key: 'dataSyncsSummary',
  invalidations: [InvalidateAction.StreamingSync.Sync],
  dependencies: () => [],
  request: dataSyncsSummaryRequest,
  mapper: (response) => {
    const latest = response.body.at(0);
    return {
      count: Number(
        response.headers.get('x-pagination-item-count') ??
          response.body.length,
      ),
      latest: latest ? mapToDataSync(latest) : null,
    };
  },
  schema: DataSyncsSummarySchema,
  ttl: time.minutes(15),
});
