import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { MAX_DATE } from '$lib/utils/constants.ts';
import { toMediaImageUrl } from '$lib/utils/url/toMediaImageUrl.ts';
import type {
  CalendarShowResponse,
  EpisodeResponse as TraktEpisodeResponse,
  UpNextResponse,
} from '@trakt/api';
import type { EpisodeEntry } from '../models/EpisodeEntry.ts';
import { type EpisodeType, EpisodeUnknownType } from '../models/EpisodeType.ts';
import { mapToPostCredits } from './mapToPostCredits.ts';
import { mayHaveImage } from './mayHaveImage.ts';
import { mapToTraktRating } from './mapToTraktRating.ts';

type EpisodeResponse =
  | UpNextResponse['progress']['next_episode']
  | CalendarShowResponse['episode']
  | TraktEpisodeResponse;

export function mapToEpisodeEntry(
  episodeResponse: EpisodeResponse,
): EpisodeEntry {
  const episode = assertDefined(
    episodeResponse,
    'Episode response is undefined',
  );
  const hasScreenshot = mayHaveImage(
    episode.images,
    episode.images?.screenshot,
  );

  const airDate = new Date(episode.first_aired ?? MAX_DATE);
  const releaseDate = new Date(episode.released ?? MAX_DATE);
  const effectiveReleaseDate = new Date(
    episode.effective_release_date ?? MAX_DATE,
  );

  return {
    id: episode.ids.trakt,
    imdbId: episode.ids.imdb,
    key: `episode-${episode.ids.trakt}`,
    type: (episode.episode_type as EpisodeType) ?? EpisodeUnknownType.unknown,
    title: episode.title ?? '',
    overview: episode.overview ?? '',
    season: episode.season,
    genres: [],
    number: episode.number,
    runtime: episode.runtime ?? NaN,
    cover: {
      url: hasScreenshot
        ? toMediaImageUrl({
            type: 'episodes',
            id: episode.ids.trakt,
            slot: 'screenshot',
            size: 'thumb',
          })
        : undefined,
    },
    airDate,
    releaseDate,
    effectiveReleaseDate,
    year: effectiveReleaseDate.getFullYear(),
    postCredits: mapToPostCredits(episode),
    rating: mapToTraktRating(episode.rating),
    ...(episode.votes != null ? { votes: episode.votes } : {}),
    ...(episode.updated_at ? { updatedAt: new Date(episode.updated_at) } : {}),
  };
}
