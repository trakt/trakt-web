import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaStats } from '$lib/requests/_internal/mapToMediaStats.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaStatsSchema } from '$lib/requests/models/MediaStats.ts';
import { time } from '$lib/utils/timing/time.ts';

type MovieStatsParams = {
  slug: string;
} & ApiParams;

const movieStatsRequest = (
  { fetch, slug }: MovieStatsParams,
) =>
  api({ fetch })
    .movies
    .stats({
      params: {
        id: slug,
      },
    });

export const movieStatsQuery = defineQuery({
  key: 'movieStats',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: movieStatsRequest,
  mapper: (response) => mapToMediaStats(response.body),
  schema: MediaStatsSchema,
  ttl: time.minutes(30),
});
