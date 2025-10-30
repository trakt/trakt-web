import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import { weave } from '$lib/utils/array/weave.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { getRecordDependencies } from '../../_internal/getRecordDependencies.ts';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';
import { moviePopularRequest } from '../movies/moviePopularQuery.ts';
import { showPopularRequest } from '../shows/showPopularQuery.ts';

type MediaPopularParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & SearchParams;

const PopularMediaSchema = z.union([ShowEntrySchema, MovieEntrySchema]);

export const mediaPopularQuery = defineQuery({
  key: 'mediaPopular',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params: MediaPopularParams,
  ) => [
    params.limit,
    params.page,
    ...getGlobalFilterDependencies(
      params.filterOverride?.movie ?? params.filter,
    ),
    ...getRecordDependencies(params.search),
  ],
  request: (params) =>
    Promise.all([
      showPopularRequest(params),
      moviePopularRequest(params),
    ]),
  mapper: ([showsResponse, moviesResponse]) => {
    const shows = showsResponse.body.map(mapToShowEntry);
    const movies = moviesResponse.body.map(mapToMovieEntry);

    return {
      entries: weave(shows, movies),
      page: extractPageMeta(showsResponse.headers),
    };
  },
  schema: PaginatableSchemaFactory(PopularMediaSchema),
  ttl: time.hours(1),
});
