import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapStatsResponseToMediaStats } from '$lib/requests/_internal/mapStatsResponseToMediaStats.ts';
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
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch show stats');
      }

      return response.body;
    });

export const showStatsQuery = defineQuery({
  key: 'showStats',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showStatsRequest,
  mapper: mapStatsResponseToMediaStats,
  schema: MediaStatsSchema,
  ttl: time.minutes(30),
});
