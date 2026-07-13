import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { coalesceEpisodes } from '$lib/requests/_internal/coalesceEpisodes.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToUpcomingEpisodeEntry } from '$lib/requests/_internal/mapToUpcomingEpisodeEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import type {
  CalendarMovieResponse,
  CalendarShowResponse,
  HotReleaseResponse,
} from '@trakt/api';
import { z } from 'zod';
import { UpcomingEpisodeEntrySchema } from './upcomingEpisodesQuery.ts';

export type ReleasesCalendarParams =
  & {
    startDate: string;
    days: number;
    type: DiscoverMode;
  }
  & ApiParams
  & FilterParams;

const ReleasesCalendarEntrySchema = z.union([
  UpcomingEpisodeEntrySchema,
  MovieEntrySchema,
]);

export type ReleasesCalendarEntry = z.infer<typeof ReleasesCalendarEntrySchema>;

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

const releasesCalendarRequest = (
  { fetch, startDate, days, type, filter }: ReleasesCalendarParams,
) => {
  return api({ fetch })
    .calendars
    .releasesHot({
      query: {
        extended: 'full,images',
        ...filter,
        ...(type === 'media' ? {} : { type }),
      },
      params: {
        start_date: startDate,
        days,
      },
    });
};

export const releasesCalendarQuery = defineQuery({
  key: 'releasesCalendar',
  invalidations: [
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Drop('show'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params: ReleasesCalendarParams,
  ) => [
    params.type,
    params.startDate,
    params.days,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: releasesCalendarRequest,
  mapper: (response) => {
    const movies = response.body
      .filter(isCalendarMovie)
      .map((entry) => mapToMovieEntry(entry.movie));

    const episodes = coalesceEpisodes(
      response.body
        .filter(isCalendarShow)
        .map(mapToUpcomingEpisodeEntry),
    );

    return [...episodes, ...movies]
      .toSorted((a, b) =>
        a.effectiveReleaseDate.getTime() - b.effectiveReleaseDate.getTime()
      );
  },
  schema: ReleasesCalendarEntrySchema.array(),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
