import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { coalesceEpisodes } from '$lib/requests/_internal/coalesceEpisodes.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
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
    });

export const upcomingEpisodesQuery = defineQuery({
  key: 'upcomingEpisodes',
  invalidations: [
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Drop,
  ],
  dependencies: (params) => [params.startDate, params.days],
  request: upcomingEpisodesRequest,
  mapper: (response) => {
    const episodes = response.body.map((item) => ({
      show: mapToShowEntry(item.show),
      ...mapToEpisodeEntry(item.episode),
    }));

    return coalesceEpisodes(episodes);
  },
  schema: UpcomingEpisodeEntrySchema.array(),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
