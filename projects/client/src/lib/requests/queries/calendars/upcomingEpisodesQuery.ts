import { coalesceEpisodes } from '$lib/requests/_internal/coalesceEpisodes.ts';
import { mapEpisodeResponseToEpisodeEntry } from '$lib/requests/_internal/mapEpisodeResponseToEpisodeEntry.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import type { EpisodeEntry } from '../../models/EpisodeEntry.ts';

export type CalendarShowsParams = {
  startDate: string;
  days: number;
} & ApiParams;

export type UpcomingEpisodeEntry = EpisodeEntry & {
  show: ShowEntry;
};

function upcomingEpisodesRequest({
  startDate,
  days,
  fetch,
}: CalendarShowsParams): Promise<UpcomingEpisodeEntry[]> {
  return api({ fetch })
    .calendars
    .shows({
      query: {
        extended: 'full,cloud9',
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

      const episodes = body
        .map((item) => ({
          show: mapShowResponseToShowSummary(item.show),
          ...mapEpisodeResponseToEpisodeEntry(item.episode),
        }));

      return coalesceEpisodes(episodes);
    });
}

export const upcomingEpisodeQueryKey = ['upcomingEpisodes'] as const;
export const upcomingEpisodesQuery = (params: CalendarShowsParams) => ({
  queryKey: upcomingEpisodeQueryKey,
  queryFn: () => upcomingEpisodesRequest(params),
});
