import type { SortDirection, UpNextResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/_internal/api.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta';
import { mapEpisodeResponseToEpisodeEntry } from '$lib/requests/_internal/mapEpisodeResponseToEpisodeEntry.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { EpisodeProgressEntrySchema } from '$lib/requests/models/EpisodeProgressEntry.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
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
  const { fetch, page = 1, limit, sort } = params;
  const sortQuery = sort?.by && sort?.direction
    ? {
      sort_by: sort.by,
      sort_how: sort.direction,
    }
    : {};

  return api({ fetch })
    .sync
    .progress
    .upNext({
      query: {
        extended: 'full,cloud9',
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

function mapUpNextResponse(item: UpNextResponse[0]): UpNextEntry {
  const episode = item.progress.next_episode;

  return {
    show: mapShowResponseToShowSummary(item.show),
    ...mapEpisodeResponseToEpisodeEntry(episode),
    total: item.progress.aired,
    completed: item.progress.completed,
    remaining: item.progress.aired - item.progress.completed,
    minutesLeft: item.progress.stats?.minutes_left ?? 0,
  };
}

export const upNextQuery = await defineQuery({
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
});
