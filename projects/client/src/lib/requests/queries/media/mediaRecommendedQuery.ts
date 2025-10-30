import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LimitParams } from '$lib/requests/models/LimitParams.ts';
import { weave } from '$lib/utils/array/weave.ts';
import { time } from '$lib/utils/timing/time.ts';
import type {
  RecommendedMovieResponse,
  RecommendedShowResponse,
} from '@trakt/api';
import { z } from 'zod';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import {
  RecommendedMovieSchema,
  recommendedMoviesRequest,
} from '../recommendations/recommendedMoviesQuery.ts';
import {
  RecommendedShowSchema,
  recommendedShowsRequest,
} from '../recommendations/recommendedShowsQuery.ts';

type RecommendedMediaParams = LimitParams & ApiParams & FilterParams;

const RecommendedMediaSchema = z.union([
  RecommendedShowSchema,
  RecommendedMovieSchema,
]);

export const recommendedMediaQuery = defineQuery({
  key: 'recommendedMedia',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params: RecommendedMediaParams,
  ) => [
    params.limit,
    params.filter?.watch_window,
    ...getGlobalFilterDependencies(
      params.filterOverride?.movie ?? params.filter,
    ),
  ],
  request: (params) =>
    Promise.all([
      recommendedShowsRequest(params),
      recommendedMoviesRequest(params),
    ]),
  mapper: ([showsResponse, moviesResponse]) => {
    const shows = showsResponse.body.map((show: RecommendedShowResponse[0]) =>
      mapToShowEntry(show)
    );
    const movies = moviesResponse.body.map((
      movie: RecommendedMovieResponse[0],
    ) => mapToMovieEntry(movie));

    return weave(shows, movies);
  },
  schema: RecommendedMediaSchema.array(),
  ttl: time.hours(24),
});
