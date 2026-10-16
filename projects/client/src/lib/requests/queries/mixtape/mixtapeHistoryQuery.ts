import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { mapToMixtapeMedia } from './_internal/mapToMixtapeMedia.ts';
import { MixtapeMediaResponseSchema } from './_internal/MixtapeMediaResponseSchema.ts';

const MixtapeHistoryResponseSchema = z.array(MixtapeMediaResponseSchema);

type MixtapeHistoryParams = { type: MediaType } & ApiParams;

const mixtapeHistoryRequest = async (
  { fetch, type }: MixtapeHistoryParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/mixtape/history?type=${type}&extended=full,images`,
  });

  return response.ok
    ? {
      body: MixtapeHistoryResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const mixtapeHistoryQuery = defineQuery({
  key: 'mixtapeHistory',
  invalidations: [
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: (params: MixtapeHistoryParams) => [params.type],
  request: mixtapeHistoryRequest,
  mapper: (response) =>
    (response.body ?? []).flatMap((entry) => {
      const media = mapToMixtapeMedia(entry);
      return media ? [media] : [];
    }),
  schema: z.array(z.union([MovieEntrySchema, ShowEntrySchema])),
  ttl: time.minutes(30),
});
