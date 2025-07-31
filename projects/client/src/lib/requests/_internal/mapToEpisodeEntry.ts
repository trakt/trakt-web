import { thumbUrl } from '$lib/requests/_internal/thumbUrl.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { CalendarShowListResponse, UpNextResponse } from '@trakt/api';
import type { EpisodeEntry } from '../models/EpisodeEntry.ts';
import { type EpisodeType, EpisodeUnknownType } from '../models/EpisodeType.ts';
import { mapToCreditCookies } from './mapToCreditCookies.ts';

type EpisodeResponse =
  | UpNextResponse[0]['progress']['next_episode']
  | CalendarShowListResponse[0]['episode'];

export function mapToEpisodeEntry(
  episode: EpisodeResponse,
): EpisodeEntry {
  const posterCandidate = findDefined(...(episode.images?.screenshot ?? []));

  const airDate = new Date(episode.first_aired);

  return {
    id: episode.ids.trakt,
    type: episode.episode_type as EpisodeType ??
      EpisodeUnknownType.unknown,
    title: episode.title,
    overview: episode.overview ?? '',
    season: episode.season,
    genres: [],
    number: episode.number,
    runtime: episode.runtime ?? NaN,
    cover: {
      url: prependHttps(
        thumbUrl(posterCandidate),
      ),
    },
    airDate,
    year: airDate.getFullYear(),
    creditCookies: mapToCreditCookies(episode),
  };
}
