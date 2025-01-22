import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapStatsResponseToMediaStats } from '$lib/requests/_internal/mapStatsResponseToMediaStats.ts';
import { MediaStatsSchema } from '$lib/requests/models/MediaStats.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

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
});
