import { api } from '$lib/requests/internal/api.ts';
import { prependHttps } from '$lib/utils/prependHttps.ts';

export type CalendarShowsParams = {
  startDate: string;
  days: number;
};

export type EpisodeEntry = {
  season: number;
  number: number;
  title: string;
  show: {
    title: string;
  };
  poster: {
    url: string;
  };
};

export function upcomingEpisodes({
  startDate,
  days,
}: CalendarShowsParams): Promise<EpisodeEntry[]> {
  return api.calendars
    .shows({
      query: {
        extended: 'cloud9',
      },
      params: {
        target: 'my',
        start_date: startDate,
        days,
      },
      extraHeaders: {
        Authorization: `Bearer ${TRAKT_BEARER_TOKEN}`,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch calendar');
      }

      return body
        .map((item) => {
          const posterCandidate = item.episode.images.screenshot.at(0) ??
            item.show.images.fanart.at(0);

          return {
            show: {
              title: item.show.title,
            },
            title: item.episode.title,
            season: item.episode.season,
            number: item.episode.number,
            poster: {
              url: prependHttps(posterCandidate),
            },
          };
        });
    });
}
