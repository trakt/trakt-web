import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { ShowHotResponse } from '@trakt/api';
import { z } from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { getRecordDependencies } from '../../_internal/getRecordDependencies.ts';
import { mapToEpisodeCount } from '../../_internal/mapToEpisodeCount.ts';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import type { SearchParams } from '../../models/SearchParams.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

export const HotShowSchema = ShowEntrySchema
  .merge(EpisodeCountSchema.partial())
  .extend({
    score: z.number(),
  });
export type HotShow = z.infer<typeof HotShowSchema>;

type ShowHotParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

function mapToHotShow({
  list_count,
  show,
}: ShowHotResponse): HotShow {
  return {
    score: list_count,
    ...mapToEpisodeCount(show),
    ...mapToShowEntry(show),
  };
}

const showHotRequest = (
  { fetch, limit, page, filter, search }: ShowHotParams,
) => {
  return api({ fetch })
    .shows
    .hot({
      query: {
        extended: 'full,images,colors',
        ignore_collected: true,
        page,
        limit,
        ...filter,
        ...search,
      },
    });
};

export const showHotQuery = defineQuery({
  key: 'showHot',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: (
    params,
  ) => [
    params.limit,
    params.page,
    ...getGlobalFilterDependencies(params.filter),
    ...getRecordDependencies(params.search),
  ],
  request: showHotRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToHotShow),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(HotShowSchema),
  ttl: time.hours(1),
});
