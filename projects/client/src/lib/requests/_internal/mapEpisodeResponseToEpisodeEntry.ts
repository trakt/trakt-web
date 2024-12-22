import type { CalendarShowListResponse, UpNextResponse } from '$lib/api.ts';
import type { EpisodeEntry } from '$lib/models/EpisodeEntry.ts';
import {
  type EpisodeType,
  EpisodeUnknownType,
} from '$lib/models/EpisodeType.ts';
import { thumbUrl } from '$lib/requests/_internal/thumbUrl.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';

type EpisodeResponse =
  | UpNextResponse[0]['progress']['next_episode']
  | CalendarShowListResponse[0]['episode'];

export function mapEpisodeResponseToEpisodeEntry(
  episode: EpisodeResponse,
): EpisodeEntry {
  const posterCandidate = findDefined(
    episode.images?.screenshot.at(1),
    episode.images?.screenshot.at(0),
  );

  return {
    id: episode.ids.trakt,
    type: episode.episode_type as EpisodeType ??
      EpisodeUnknownType.Unknown,
    title: episode.title,
    season: episode.season,
    number: episode.number,
    runtime: episode.runtime,
    poster: {
      url: prependHttps(
        thumbUrl(posterCandidate),
      ),
    },
    airedDate: new Date(episode.first_aired),
  };
}
