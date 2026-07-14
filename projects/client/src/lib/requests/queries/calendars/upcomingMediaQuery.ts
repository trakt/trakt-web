import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUpcomingEpisodeEntry } from '$lib/requests/_internal/mapToUpcomingEpisodeEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import type {
  CalendarMovieResponse,
  CalendarShowResponse,
  HotReleaseResponse,
} from '@trakt/api';
import z from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import type { FilterParams } from '../../models/FilterParams.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';
import { UpcomingEpisodeEntrySchema } from './upcomingEpisodesQuery.ts';

export type CalendarMediaParams =
  & {
    startDate: string;
    days: number;
    target?: 'my' | 'all';
  }
  & ApiParams
  & FilterParams;

const UpcomingMediaSchema = z.union([
  UpcomingEpisodeEntrySchema,
  MovieEntrySchema,
]);

function isCalendarMovie(
  entry: HotReleaseResponse,
): entry is CalendarMovieResponse {
  return 'movie' in entry;
}

function isCalendarShow(
  entry: HotReleaseResponse,
): entry is CalendarShowResponse {
  return 'episode' in entry;
}

export const upcomingMediaQuery = defineQuery({
  key: 'upcomingMedia',
  invalidations: [
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Drop('show'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params: CalendarMediaParams,
  ) => [
    params.target,
    params.startDate,
    params.days,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: ({ fetch, startDate, days, target = 'my', filter }) =>
    api({ fetch })
      .calendars
      .media({
        query: {
          extended: 'full,images',
          group: 'day',
          ...filter,
        },
        params: {
          target,
          start_date: startDate,
          days,
        },
      }),
  mapper: (response) => {
    const episodes = response.body
      .filter(isCalendarShow)
      .map(mapToUpcomingEpisodeEntry);

    const movies = response.body
      .filter(isCalendarMovie)
      .map((entry) => mapToMovieEntry(entry.movie));

    return [...episodes, ...movies]
      .toSorted((a, b) =>
        a.effectiveReleaseDate.getTime() - b.effectiveReleaseDate.getTime()
      );
  },
  schema: UpcomingMediaSchema.array(),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
