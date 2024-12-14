import { authHeader } from '$lib/features/auth/stores/authHeader.ts';
import type { EpisodeEntry } from '$lib/models/EpisodeEntry.ts';
import { mapEpisodeResponseToEpisodeEntry } from '$lib/requests/_internal/mapEpisodeResponseToEpisodeEntry.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

export type CalendarShowsParams = {
  startDate: string;
  days: number;
} & ApiParams;

export type UpcomingEpisodeEntry = EpisodeEntry & {
  show: ShowSummary;
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
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch calendar');
      }

      return body
        .map((item) => ({
          show: mapShowResponseToShowSummary(item.show),
          ...mapEpisodeResponseToEpisodeEntry(item.episode),
        }));
    });
}

export const upcomingEpisodeQueryKey = ['upcomingEpisodes'] as const;
export const upcomingEpisodesQuery = (params: CalendarShowsParams) => ({
  queryKey: upcomingEpisodeQueryKey,
  queryFn: () => upcomingEpisodesRequest(params),
});
