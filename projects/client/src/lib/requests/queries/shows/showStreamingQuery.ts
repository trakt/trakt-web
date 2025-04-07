import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { ShowStreamingResponse } from '@trakt/api';
import { z } from 'zod';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';

export const StreamingShowSchema = ShowEntrySchema.extend({
  rank: z.number(),
  delta: z.number(),
});
export type StreamingShow = z.infer<typeof StreamingShowSchema>;

type ShowStreamingParams = PaginationParams & ApiParams;

function mapToStreamingShow({
  rank,
  delta,
  show,
}: ShowStreamingResponse): StreamingShow {
  return {
    rank,
    delta: delta ?? 0,
    ...mapToShowEntry(show),
  };
}

const showStreamingRequest = (
  { fetch, limit, page }: ShowStreamingParams,
) =>
  api({ fetch })
    .shows
    .streaming({
      params: {
        period: 'daily',
      },
      query: {
        extended: 'full,images',
        watchnow: 'favorites',
        ignore_collected: true,
        ignore_watchlisted: true,
        ignore_watched: true,
        page,
        limit,
      },
    });

export const showStreamingQuery = defineQuery({
  key: 'showStreaming',
  invalidations: [
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('show'),
  ],
  dependencies: (params) => [params.limit, params.page],
  request: showStreamingRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToStreamingShow),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(StreamingShowSchema),
  ttl: time.hours(1),
});
