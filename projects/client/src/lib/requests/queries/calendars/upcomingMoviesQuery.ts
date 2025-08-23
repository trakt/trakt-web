import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

export type CalendarMoviesParams = {
  startDate: string;
  days: number;
} & ApiParams;

const upcomingMoviesRequest = (
  { fetch, startDate, days }: CalendarMoviesParams,
) =>
  api({ fetch })
    .calendars
    .movies({
      query: {
        extended: 'full,images',
      },
      params: {
        target: 'my',
        start_date: startDate,
        days,
      },
    });

export const upcomingMoviesQuery = defineQuery({
  key: 'upcomingMovies',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (params) => [params.startDate, params.days],
  request: upcomingMoviesRequest,
  mapper: (response) =>
    response.body.map((entry) => mapToMovieEntry(entry.movie)),
  schema: MovieEntrySchema.array(),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
