import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeProgressEntrySchema } from '$lib/requests/models/EpisodeProgressEntry.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { mapUpNextResponse } from '$lib/requests/queries/sync/upNextQuery.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

export const UpNextEntryNitroSchema = EpisodeProgressEntrySchema.merge(
  z.object({
    show: ShowEntrySchema,
  }),
);

type UpNextParams = {
  page?: number;
  limit?: number;
} & ApiParams;

const upNextNitroRequest = (params: UpNextParams = {}) => {
  const { fetch, page = 1, limit = DEFAULT_PAGE_SIZE } = params;

  return api({ fetch })
    .sync
    .progress
    .upNext
    .nitro({
      query: {
        page,
        limit,
      },
    })
    .then(({ status, body, headers }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up next');
      }

      return { body, headers };
    });
};

export const upNextNitroQuery = defineQuery({
  key: 'upNext',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Drop,
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
