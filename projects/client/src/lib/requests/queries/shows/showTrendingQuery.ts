import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { ShowTrendingResponse } from '@trakt/api';
import { z } from 'zod';
import { mapToEpisodeCount } from '../../_internal/mapToEpisodeCount.ts';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

export const TrendingShowSchema = ShowEntrySchema
  .merge(EpisodeCountSchema)
  .extend({
    watchers: z.number(),
  });
export type TrendingShow = z.infer<typeof TrendingShowSchema>;

type ShowTrendingParams = PaginationParams & ApiParams;

function mapToTrendingShow({
  watchers,
  show,
}: ShowTrendingResponse): TrendingShow {
  return {
    watchers,
    ...mapToEpisodeCount(show),
    ...mapToShowEntry(show),
  };
}

const showTrendingRequest = (
  { fetch, limit, page }: ShowTrendingParams,
) =>
  api({ fetch })
    .shows
    .trending({
      query: {
        extended: 'full,images',
        ignore_collected: true,
        ignore_watchlisted: true,
        ignore_watched: true,
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
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: (params) => [params.limit, params.page],
  request: showTrendingRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToTrendingShow),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(TrendingShowSchema),
  ttl: time.hours(1),
});
