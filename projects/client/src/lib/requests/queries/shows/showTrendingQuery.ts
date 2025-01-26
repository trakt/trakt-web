import type { ShowTrendingResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { mapShowResponseToShowSummary } from '../../_internal/mapShowResponseToShowSummary.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

export const TrendingShowSchema = ShowEntrySchema
  .merge(EpisodeCountSchema)
  .extend({
    watchers: z.number(),
  });
export type TrendingShow = z.infer<typeof TrendingShowSchema>;

type ShowTrendingParams = {
  page?: number;
  limit?: number;
} & ApiParams;

function mapResponseToTrendingShow({
  watchers,
  show,
}: ShowTrendingResponse): TrendingShow {
  return {
    watchers,
    episode: {
      count: show.aired_episodes ?? NaN,
    },
    ...mapShowResponseToShowSummary(show),
  };
}

const showTrendingRequest = (
  { fetch, limit = DEFAULT_PAGE_SIZE, page = 1 }: ShowTrendingParams,
) =>
  api({ fetch })
    .shows
    .trending({
      query: {
        extended: 'full,cloud9',
        page,
        limit,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch trending shows');
      }

      return response;
    });

export const showTrendingQuery = defineQuery({
  key: 'showTrending',
  invalidations: [],
  dependencies: (params) => [params.limit, params.page],
  request: showTrendingRequest,
  mapper: (response) => ({
    entries: response.body.map(mapResponseToTrendingShow),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(TrendingShowSchema),
  ttl: time.hours(1),
});
