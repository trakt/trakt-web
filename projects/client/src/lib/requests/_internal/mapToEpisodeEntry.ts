import { thumbUrl } from '$lib/requests/_internal/thumbUrl.ts';
import { MAX_DATE } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { CalendarShowResponse, UpNextResponse } from '@trakt/api';
import type { EpisodeEntry } from '../models/EpisodeEntry.ts';
import { type EpisodeType, EpisodeUnknownType } from '../models/EpisodeType.ts';
import { mapToPostCredits } from './mapToPostCredits.ts';
import { mapToTraktRating } from './mapToTraktRating.ts';

type EpisodeResponse =
  | UpNextResponse[0]['progress']['next_episode']
  | CalendarShowResponse['episode'];

export function mapToEpisodeEntry(
  episode: EpisodeResponse,
): EpisodeEntry {
  const posterCandidate = findDefined(...(episode.images?.screenshot ?? []));

  const airDate = new Date(episode.first_aired ?? MAX_DATE);

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
    postCredits: mapToPostCredits(episode),
    rating: mapToTraktRating(episode.rating),
  };
}
