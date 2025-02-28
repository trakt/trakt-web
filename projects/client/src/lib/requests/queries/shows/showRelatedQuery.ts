import { type ShowResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToEpisodeCount } from '$lib/requests/_internal/mapToEpisodeCount.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { z } from 'zod';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

type ShowRelatedParams = {
  slug: string;
  page?: number;
  limit?: number;
} & ApiParams;

const RelatedShowSchema = ShowEntrySchema.merge(EpisodeCountSchema);
export type RelatedShow = z.infer<typeof RelatedShowSchema>;

function mapToRelatedShow(show: ShowResponse) {
  return {
    ...mapToEpisodeCount(show),
    ...mapToShowEntry(show),
  };
}

const showRelatedRequest = (
  { fetch, slug, limit = DEFAULT_PAGE_SIZE, page = 1 }: ShowRelatedParams,
) =>
  api({ fetch })
    .shows
    .related({
      query: {
        extended: 'full,images',
        limit,
        page,
      },
      params: {
        id: slug,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch related shows');
      }

      return response;
    });

export const showRelatedQuery = defineQuery({
  key: 'showRelated',
  invalidations: [],
  dependencies: (params) => [params.slug, params.page, params.limit],
  request: showRelatedRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToRelatedShow),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(RelatedShowSchema),
  ttl: time.days(7),
});
