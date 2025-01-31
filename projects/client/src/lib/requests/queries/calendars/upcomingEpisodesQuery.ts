import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { coalesceEpisodes } from '$lib/requests/_internal/coalesceEpisodes.ts';
import { mapEpisodeResponseToEpisodeEntry } from '$lib/requests/_internal/mapEpisodeResponseToEpisodeEntry.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { EpisodeEntrySchema } from '../../models/EpisodeEntry.ts';

export type CalendarShowsParams = {
  startDate: string;
  days: number;
} & ApiParams;

export const UpcomingEpisodeEntrySchema = EpisodeEntrySchema.merge(z.object({
  show: ShowEntrySchema,
}));
export type UpcomingEpisodeEntry = z.infer<typeof UpcomingEpisodeEntrySchema>;

const upcomingEpisodesRequest = (
  { fetch, startDate, days }: CalendarShowsParams,
) =>
  api({ fetch })
    .calendars
    .shows({
      query: {
        extended: 'full,images',
      },
      params: {
        target: 'my',
        start_date: startDate,
        days,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch calendar');
      }
      return body;
    });

export const upcomingEpisodesQuery = defineQuery({
  key: 'upcomingEpisodes',
  invalidations: [InvalidateAction.Watchlisted('show')],
  dependencies: (params) => [params.startDate, params.days],
  request: upcomingEpisodesRequest,
  mapper: (response) => {
    const episodes = response.map((item) => ({
      show: mapShowResponseToShowSummary(item.show),
      ...mapEpisodeResponseToEpisodeEntry(item.episode),
    }));

    return coalesceEpisodes(episodes);
  },
  schema: UpcomingEpisodeEntrySchema.array(),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
