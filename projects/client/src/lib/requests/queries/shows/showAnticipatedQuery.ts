import type { ShowAnticipatedResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

export const AnticipatedShowSchema = ShowEntrySchema
  .merge(EpisodeCountSchema.partial())
  .extend({
    score: z.number(),
  });
export type AnticipatedShow = z.infer<typeof AnticipatedShowSchema>;

type ShowAnticipatedParams = PaginationParams & ApiParams;

function mapToAnticipatedShow({
  list_count,
  show,
}: ShowAnticipatedResponse): AnticipatedShow {
  const { aired_episodes } = show;
  const episodeCount = aired_episodes && aired_episodes > 0
    ? { episode: { count: aired_episodes } }
    : {};

  return {
    score: list_count,
    ...mapToShowEntry(show),
    ...episodeCount,
  };
}

const showAnticipatedRequest = (
  { fetch, limit, page }: ShowAnticipatedParams,
) =>
  api({ fetch })
    .shows
    .anticipated({
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
        throw new Error('Failed to fetch anticipated shows');
      }

      return response;
    });

export const showAnticipatedQuery = defineQuery({
  key: 'showAnticipated',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: (params) => [params.limit, params.page],
  request: showAnticipatedRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToAnticipatedShow),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(AnticipatedShowSchema),
  ttl: time.days(1),
});
