import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { DataSyncSchema } from '$lib/requests/models/DataSync.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToDataSync } from './_internal/mapToDataSync.ts';

type DataSyncParams = { id: number } & ApiParams;

const dataSyncRequest = (
  { fetch, id }: DataSyncParams,
) =>
  api({ fetch })
    .users
    .syncs
    .details({
      params: { id },
    });

export const dataSyncQuery = defineQuery({
  key: 'dataSync',
  invalidations: [InvalidateAction.StreamingSync.Sync],
  dependencies: (params) => [params.id],
  request: dataSyncRequest,
  mapper: (response) => mapToDataSync(response.body),
  schema: DataSyncSchema,
  ttl: time.minutes(15),
  enabled: (params) => Number.isFinite(params.id),
});
