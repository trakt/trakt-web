import type { SortDirection, UpNextResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeProgressEntrySchema } from '$lib/requests/models/EpisodeProgressEntry.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

export const UpNextEntrySchema = EpisodeProgressEntrySchema.merge(z.object({
  show: ShowEntrySchema,
}));
export type UpNextEntry = z.infer<typeof UpNextEntrySchema>;

type UpNextParams = {
  page?: number;
  limit?: number;
  sort?: {
    by?: string;
    direction?: SortDirection;
  };
} & ApiParams;

const upNextRequest = (params: UpNextParams = {}) => {
  const { fetch, page = 1, limit = DEFAULT_PAGE_SIZE, sort } = params;
  const sortQuery = sort?.by && sort?.direction
    ? {
      sort_by: sort.by,
      sort_how: sort.direction,
    }
    : {};

  return api({ fetch })
    .sync
    .progress
    .upNext
    .standard({
      query: {
        extended: 'full,images',
        page,
        limit,
        include_stats: true,
        ...sortQuery,
      },
    })
    .then(({ status, body, headers }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up next');
      }

      return { body, headers };
    });
};

export function mapUpNextResponse(item: UpNextResponse[0]): UpNextEntry {
  const episode = item.progress.next_episode;

  return {
    show: mapToShowEntry(item.show),
    ...mapToEpisodeEntry(episode),
    total: item.progress.aired,
    completed: item.progress.completed,
    remaining: item.progress.aired - item.progress.completed,
    minutesLeft: item.progress.stats?.minutes_left ?? 0,
  };
}

export const upNextQuery = defineQuery({
  key: 'upNext',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: (
    params: UpNextParams,
  ) => [params.page, params.limit, params.sort?.by, params.sort?.direction],
  request: upNextRequest,
  mapper: (response) => ({
    entries: response.body.map(mapUpNextResponse),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(UpNextEntrySchema),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
