import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { ShowResponse } from '@trakt/api';
import { z } from 'zod';
import { getRecordDependencies } from '../../_internal/getRecordDependencies.ts';

export const PopularShowSchema = ShowEntrySchema.merge(
  EpisodeCountSchema.partial(),
);
export type PopularShow = z.infer<typeof PopularShowSchema>;

type ShowPopularParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

function mapToPopularShow(show: ShowResponse): PopularShow {
  const { aired_episodes } = show;
  const episodeCount = aired_episodes && aired_episodes > 0
    ? { episode: { count: aired_episodes } }
    : {};

  return {
    ...mapToShowEntry(show),
    ...episodeCount,
  };
}

const showPopularRequest = (
  { fetch, limit, page, filter, search }: ShowPopularParams,
) =>
  api({ fetch })
    .shows
    .popular({
      query: {
        extended: 'full,images,colors',
        page,
        limit,
        ...filter,
        ...search,
      },
    });

export const showPopularQuery = defineQuery({
  key: 'showPopular',
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
  request: showPopularRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToPopularShow),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(PopularShowSchema),
  ttl: time.hours(1),
});
