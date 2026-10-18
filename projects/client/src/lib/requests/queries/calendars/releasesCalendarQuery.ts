import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { mapToCalendarMedia } from '$lib/requests/_internal/mapToCalendarMedia.ts';
import { type ApiParams, unauthorizedApi } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { UpcomingEpisodeEntrySchema } from './upcomingEpisodesQuery.ts';

export type ReleasesCalendarParams = {
  startDate: string;
  days: number;
  type: DiscoverMode;
} & ApiParams &
  FilterParams;

const ReleasesCalendarEntrySchema = z.union([
  UpcomingEpisodeEntrySchema,
  MovieEntrySchema,
]);

export type ReleasesCalendarEntry = z.infer<typeof ReleasesCalendarEntrySchema>;

const releasesCalendarRequest = ({
  fetch,
  startDate,
  days,
  type,
  filter,
}: ReleasesCalendarParams) => {
  return unauthorizedApi({ fetch }).calendars.releasesHot({
    query: {
      extended: 'full,images',
      group: 'day',
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
  invalidations: [],
  dependencies: (params: ReleasesCalendarParams) => [
    params.type,
    params.startDate,
    params.days,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: releasesCalendarRequest,
  mapper: (response) => mapToCalendarMedia(response.body),
  schema: ReleasesCalendarEntrySchema.array(),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
