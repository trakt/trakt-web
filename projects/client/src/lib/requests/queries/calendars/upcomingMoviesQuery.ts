import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import type { FilterParams } from '../../models/FilterParams.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

export type CalendarMoviesParams =
  & {
    startDate: string;
    days: number;
    target?: 'my' | 'all';
  }
  & ApiParams
  & FilterParams;

export const upcomingMoviesRequest = (
  { fetch, startDate, days, filter, filterOverride, target = 'my' }:
    CalendarMoviesParams,
) => {
  const filterParams = filterOverride?.movie ?? filter;

  return api({ fetch })
    .calendars
    .movies({
      query: {
        extended: 'full,images',
        ...filterParams,
      },
      params: {
        target,
        start_date: startDate,
        days,
      },
    });
};

export const upcomingMoviesQuery = defineQuery({
  key: 'upcomingMovies',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params,
  ) => [
    params.target,
    params.startDate,
    params.days,
    ...getGlobalFilterDependencies(
      params.filterOverride?.movie ?? params.filter,
    ),
  ],
  request: upcomingMoviesRequest,
  mapper: (response) =>
    response.body.map((entry) => mapToMovieEntry(entry.movie)),
  schema: MovieEntrySchema.array(),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
