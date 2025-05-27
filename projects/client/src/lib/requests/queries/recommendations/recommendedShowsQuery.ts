import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { mapToEpisodeCount } from '$lib/requests/_internal/mapToEpisodeCount.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LimitParams } from '$lib/requests/models/LimitParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { RecommendedShowResponse } from '@trakt/api';
import { z } from 'zod';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import { MediaEntrySchema } from '../../models/MediaEntry.ts';
import { sourceToMethod } from './_internal/sourceToMethod.ts';
import type { RecommendationSourceParams } from './RecommendationSourceParams.ts';

export const RecommendedShowSchema = MediaEntrySchema.merge(EpisodeCountSchema);
export type RecommendedShow = z.infer<typeof RecommendedShowSchema>;

type RecommendedShowsParams =
  & LimitParams
  & ApiParams
  & FilterParams
  & RecommendationSourceParams;

const recommendedShowsRequest = (
  { fetch, limit, filter, source }: RecommendedShowsParams,
) =>
  api({
    fetch,
  })[sourceToMethod({ source })]
    .shows
    .recommend({
      query: {
        extended: 'full,images,colors',
        ignore_collected: true,
        limit,
        ...filter,
      },
    });

export const recommendedShowsQuery = defineQuery({
  key: (params) => `${params.source}_recommendedShows`,
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: (
    params,
  ) => [
    params.limit,
    params.filter?.watch_window,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: recommendedShowsRequest,
  mapper: (response) =>
    response.body.map((show: RecommendedShowResponse[0]) => ({
      ...mapToShowEntry(show),
      ...mapToEpisodeCount(show),
    })),
  schema: RecommendedShowSchema.array(),
  ttl: time.hours(24),
});
