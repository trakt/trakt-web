import type { ShowProgressResponse } from '$lib/api.ts';
import { authHeader } from '$lib/features/auth/stores/authHeader.ts';
import type { EpisodeProgressEntry } from '$lib/models/EpisodeProgressEntry.ts';
import {
  type EpisodeType,
  EpisodeUnknownType,
} from '$lib/models/EpisodeType.ts';
import { EPISODE_PLACEHOLDER } from '$lib/utils/constants.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type ShowProgressParams = { slug: string } & ApiParams;

export function mapResponseToShowProgress(
  item: ShowProgressResponse,
): EpisodeProgressEntry {
  const episode = item.next_episode;

  const posterCandidate = episode.images!.screenshot.at(1) ??
    episode.images!.screenshot.at(0);

  return {
    id: episode.ids.trakt,
    title: episode.title,
    season: episode.season,
    number: episode.number,
    poster: {
      url: prependHttps(posterCandidate, EPISODE_PLACEHOLDER),
    },
    airedDate: new Date(episode.first_aired),
    total: item.aired,
    completed: item.completed,
    remaining: item.aired - item.completed,
    minutesLeft: item.stats?.minutes_left ?? 0,
    type: episode.episode_type as EpisodeType ??
      EpisodeUnknownType.Unknown,
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
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up next');
      }
      return mapResponseToShowProgress(body);
    });
}

export const showProgressQueryKey = (id: string) =>
  ['showProgress', id] as const;
export const showProgressQuery = (
  params: ShowProgressParams,
) => ({
  queryKey: showProgressQueryKey(params.slug),
  queryFn: () => showProgressRequest(params),
});
