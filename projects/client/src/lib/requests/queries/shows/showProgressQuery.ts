import type { ShowProgressResponse } from '$lib/api.ts';
import type { EpisodeProgressEntry } from '$lib/models/EpisodeProgressEntry.ts';
import {
  type EpisodeType,
  EpisodeUnknownType,
} from '$lib/models/EpisodeType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type ShowProgressParams = { slug: string } & ApiParams;

export function mapResponseToShowProgress(
  item: ShowProgressResponse,
): EpisodeProgressEntry {
  const episode = item.next_episode;

  const posterCandidate = episode.images?.screenshot.at(1) ??
    episode.images?.screenshot.at(0);

  return {
    id: episode.ids.trakt,
    title: episode.title,
    season: episode.season,
    number: episode.number,
    runtime: episode.runtime,
    cover: {
      url: prependHttps(posterCandidate),
    },
    airedDate: new Date(episode.first_aired),
    total: item.aired,
    completed: item.completed,
    remaining: item.aired - item.completed,
    minutesLeft: item.stats?.minutes_left ?? 0,
    type: episode.episode_type as EpisodeType ??
      EpisodeUnknownType.Unknown,
    genres: [],
    overview: episode.overview,
    year: new Date(episode.first_aired).getFullYear(),
  };
}

export function showProgressRequest(
  { fetch, slug }: ShowProgressParams,
): Promise<EpisodeProgressEntry> {
  return api({ fetch })
    .shows
    .progress
    .watched({
      query: {
        count_specials: false,
        specials: false,
        hidden: false,
        extended: 'full,cloud9',
        include_stats: true,
      },
      params: {
        id: slug,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch show progress');
      }
      return mapResponseToShowProgress(body);
    });
}

export const showProgressQueryKey = (id: string) =>
  [
    'showProgress',
    id,
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
  ] as const;
export const showProgressQuery = (
  params: ShowProgressParams,
) => ({
  queryKey: showProgressQueryKey(params.slug),
  queryFn: () => showProgressRequest(params),
});
