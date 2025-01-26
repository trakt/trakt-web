import type { ShowResponse } from '$lib/api.ts';
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

export const PopularShowSchema = ShowEntrySchema.merge(
  EpisodeCountSchema.partial(),
);
export type PopularShow = z.infer<typeof PopularShowSchema>;

type ShowPopularParams = {
  page?: number;
  limit?: number;
} & ApiParams;

function mapResponseToPopularShow(show: ShowResponse): PopularShow {
  const { aired_episodes } = show;
  const episodeCount = aired_episodes && aired_episodes > 0
    ? { episode: { count: aired_episodes } }
    : {};

  return {
    ...mapShowResponseToShowSummary(show),
    ...episodeCount,
  };
}

const showPopularRequest = (
  { fetch, limit = DEFAULT_PAGE_SIZE, page = 1 }: ShowPopularParams,
) =>
  api({ fetch })
    .shows
    .popular({
      query: {
        extended: 'full,cloud9',
        page,
        limit,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch popular shows');
      }

      return response;
    });

export const showPopularQuery = defineQuery({
  key: 'showPopular',
  invalidations: [],
  dependencies: (params) => [params.limit, params.page],
  request: showPopularRequest,
  mapper: (response) => ({
    entries: response.body.map(mapResponseToPopularShow),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(PopularShowSchema),
  ttl: time.hours(1),
});
