import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { coalesceEpisodes } from '$lib/requests/_internal/coalesceEpisodes.ts';
import { mapToUpcomingEpisodeEntry } from '$lib/requests/_internal/mapToUpcomingEpisodeEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { EpisodeEntrySchema } from '../../models/EpisodeEntry.ts';
import type { FilterParams } from '../../models/FilterParams.ts';

export type CalendarShowsParams =
  & {
    startDate: string;
    days: number;
    target?: 'my' | 'all';
  }
  & ApiParams
  & FilterParams;

export const UpcomingEpisodeEntrySchema = EpisodeEntrySchema.merge(z.object({
  show: ShowEntrySchema,
}));
export type UpcomingEpisodeEntry = z.infer<typeof UpcomingEpisodeEntrySchema>;

export const upcomingEpisodesRequest = (
  { fetch, startDate, days, filter, filterOverride, target = 'my' }:
    CalendarShowsParams,
) => {
  const filterParams = filterOverride?.show ?? filter;

  return api({ fetch })
    .calendars
    .shows({
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

export const upcomingEpisodesQuery = defineQuery({
  key: 'upcomingEpisodes',
  invalidations: [
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Drop('show'),
  ],
  dependencies: (
    params,
  ) => [
    params.target,
    params.startDate,
    params.days,
    ...getGlobalFilterDependencies(
      params.filterOverride?.show ?? params.filter,
    ),
  ],
  request: upcomingEpisodesRequest,
  mapper: (response) =>
    coalesceEpisodes(response.body.map(mapToUpcomingEpisodeEntry)),
  schema: UpcomingEpisodeEntrySchema.array(),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
