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

export const RecommendedMovieSchema = MovieEntrySchema;
export type RecommendedMovie = z.infer<typeof RecommendedMovieSchema>;

type RecommendedMoviesParams = LimitParams & ApiParams & FilterParams;

export const recommendedMoviesRequest = (
  { fetch, limit, filter, filterOverride }: RecommendedMoviesParams,
) => {
  const filterParams = filterOverride?.movie ?? filter;

  return api({ fetch })
    .recommendations
    .movies
    .recommend({
      query: {
        extended: 'full,images,colors',
        ignore_collected: true,
        limit,
        ...filterParams,
        // FIXME: remove when we have tri-state filter toggles
        ignore_watched: true,
      },
    });
};

export const recommendedMoviesQuery = defineQuery({
  key: 'recommendedMovies',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params,
  ) => [
    params.limit,
    params.filter?.watch_window,
    ...getGlobalFilterDependencies(
      params.filterOverride?.movie ?? params.filter,
    ),
  ],
  request: recommendedMoviesRequest,
  mapper: (response) => response.body.map(mapToMovieEntry),
  schema: RecommendedMovieSchema.array(),
  ttl: time.hours(24),
});
