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

  const airDate = new Date(episode.first_aired);

  return {
    id: episode.ids.trakt,
    type: episode.episode_type as EpisodeType ??
      EpisodeUnknownType.Unknown,
    title: episode.title,
    overview: episode.overview,
    season: episode.season,
    genres: [],
    number: episode.number,
    runtime: episode.runtime,
    cover: {
      url: prependHttps(
        thumbUrl(posterCandidate),
      ),
    },
    airDate,
    year: airDate.getFullYear(),
  };
}
