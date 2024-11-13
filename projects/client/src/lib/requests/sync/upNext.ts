import { api } from '$lib/requests/_internal/api.ts';
import { authHeader } from '$lib/requests/_internal/authHeader.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';

export type UpNextEntry = {
  season: number;
  number: number;
  title: string;
  show: {
    title: string;
  };
  poster: {
    url: string;
  };
  total: number;
  completed: number;
  remaining: number;
};

export function upNext(): Promise<UpNextEntry[]> {
  return api.sync.progress
    .upNext({
      query: {
        extended: 'cloud9',
      },
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up next');
      }

      return body
        .map((item) => {
          const episode = item.progress.next_episode;

          const posterCandidate = episode.images!.screenshot.at(0) ??
            item.show.images!.fanart.at(0);

          return {
            show: {
              title: item.show.title,
            },
            title: episode.title,
            season: episode.season,
            number: episode.number,
            poster: {
              url: prependHttps(posterCandidate)!,
            },
            total: item.progress.aired,
            completed: item.progress.completed,
            remaining: item.progress.aired - item.progress.completed,
          };
        });
    });
}
