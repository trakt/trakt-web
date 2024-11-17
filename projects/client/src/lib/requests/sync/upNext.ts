import {
  type EpisodeType,
  EpisodeUnknownType,
} from '$lib/models/EpisodeType.ts';
import { api } from '$lib/requests/_internal/api.ts';
import { authHeader } from '$lib/requests/_internal/authHeader.ts';
import type { EpisodeEntry } from '$lib/requests/calendars/upcomingEpisodes.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';

export type UpNextEntry = EpisodeEntry & {
  total: number;
  completed: number;
  remaining: number;
  runtime: number;
};

export function upNext(): Promise<UpNextEntry[]> {
  return api.sync.progress
    .upNext({
      query: {
        extended: 'full,cloud9',
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

          const posterCandidate = episode.images!.screenshot.at(1) ??
            episode.images!.screenshot.at(0) ??
            item.show.images!.fanart.at(1) ??
            item.show.images!.fanart.at(0);

          return {
            show: {
              title: item.show.title,
              id: item.show.ids.trakt,
            },
            title: episode.title,
            season: episode.season,
            number: episode.number,
            poster: {
              url: prependHttps(posterCandidate)!,
            },
            airedDate: new Date(item.progress.aired),
            id: episode.ids.trakt,
            total: item.progress.aired,
            completed: item.progress.completed,
            remaining: item.progress.aired - item.progress.completed,
            runtime: item.show.runtime!,
            type: episode.episode_type as EpisodeType ??
              EpisodeUnknownType.Unknown,
          };
        });
    });
}
