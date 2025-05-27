import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LimitParams } from '$lib/requests/models/LimitParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { z } from 'zod';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';
import { sourceToMethod } from './_internal/sourceToMethod.ts';
import type { RecommendationSourceParams } from './RecommendationSourceParams.ts';

export const RecommendedMovieSchema = MovieEntrySchema;
export type RecommendedMovie = z.infer<typeof RecommendedMovieSchema>;

type RecommendedMoviesParams =
  & LimitParams
  & ApiParams
  & FilterParams
  & RecommendationSourceParams;

const recommendedMoviesRequest = (
  { fetch, limit, filter, source }: RecommendedMoviesParams,
) =>
  api({
    fetch,
  })[sourceToMethod({ source })]
    .movies
    .recommend({
      query: {
        extended: 'full,images,colors',
        ignore_collected: true,
        limit,
        ...filter,
      },
    });

export const recommendedMoviesQuery = defineQuery({
  key: (params) => `${params.source}_recommendedMovies`,
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params,
  ) => [
    params.limit,
    params.filter?.watch_window,
    params.source,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: recommendedMoviesRequest,
  mapper: (response) => response.body.map(mapToMovieEntry),
  schema: RecommendedMovieSchema.array(),
  ttl: time.hours(24),
});
