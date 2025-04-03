import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaStats } from '$lib/requests/_internal/mapToMediaStats.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaStatsSchema } from '$lib/requests/models/MediaStats.ts';
import { time } from '$lib/utils/timing/time.ts';

type ShowStatsParams = {
  slug: string;
} & ApiParams;

const showStatsRequest = (
  { fetch, slug }: ShowStatsParams,
) =>
  api({ fetch })
    .shows
    .stats({
      params: {
        id: slug,
      },
    });

export const showStatsQuery = defineQuery({
  key: 'showStats',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showStatsRequest,
  mapper: (response) => mapToMediaStats(response.body),
  schema: MediaStatsSchema,
  ttl: time.minutes(30),
});
