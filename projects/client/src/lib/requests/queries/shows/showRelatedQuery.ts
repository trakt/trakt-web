import { type ShowResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToEpisodeCount } from '$lib/requests/_internal/mapToEpisodeCount.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { z } from 'zod';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

type ShowRelatedParams = {
  slug: string;
} & ApiParams;

const RelatedShowSchema = ShowEntrySchema.merge(EpisodeCountSchema);
export type RelatedShow = z.infer<typeof RelatedShowSchema>;

function mapToRelatedShow(show: ShowResponse) {
  return {
    ...mapToEpisodeCount(show),
    ...mapToShowEntry(show),
  };
}

const showRelatedRequest = ({ fetch, slug }: ShowRelatedParams) =>
  api({ fetch })
    .shows
    .related({
      query: {
        extended: 'full,images',
      },
      params: {
        id: slug,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch related shows');
      }

      return response.body;
    });

export const showRelatedQuery = defineQuery({
  key: 'showRelated',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showRelatedRequest,
  mapper: (body) => body.map(mapToRelatedShow),
  schema: RelatedShowSchema.array(),
  ttl: time.days(7),
});
