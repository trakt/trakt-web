import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeProgressEntrySchema } from '$lib/requests/models/EpisodeProgressEntry.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { mapUpNextResponse } from '$lib/requests/queries/sync/upNextQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

export const UpNextEntryNitroSchema = EpisodeProgressEntrySchema.merge(
  z.object({
    show: ShowEntrySchema,
  }),
);

type UpNextParams = PaginationParams & ApiParams;

const upNextNitroRequest = (params: UpNextParams) => {
  const { fetch, limit, page } = params;

  return api({ fetch })
    .sync
    .progress
    .upNext
    .nitro({
      query: {
        page,
        limit,
      },
    });
};

export const upNextNitroQuery = defineQuery({
  key: 'upNext',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Drop,
    InvalidateAction.Restore,
    InvalidateAction.Watchlisted('show'),
  ],
  dependencies: (
    params: UpNextParams,
  ) => [params.page, params.limit],
  request: upNextNitroRequest,
  mapper: (response) => ({
    entries: response.body.map(mapUpNextResponse),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(UpNextEntryNitroSchema),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
