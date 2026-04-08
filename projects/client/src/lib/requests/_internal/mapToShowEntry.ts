import { MAX_DATE } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { type ShowResponse } from '@trakt/api';
import type { ShowEntry } from '../models/ShowEntry.ts';
import { mapToColors } from './mapToColors.ts';
import { mapToCover } from './mapToCover.ts';
import { mapToLogo } from './mapToLogo.ts';
import { mapToPoster } from './mapToPoster.ts';
import { mapToSocialMedia } from './mapToSocialMedia.ts';
import { mapToTraktRating } from './mapToTraktRating.ts';

export function mapToShowEntry(
  show: ShowResponse,
): ShowEntry {
  const poster = mapToPoster(show.images);
  const cover = mapToCover(show.images);
  const logo = mapToLogo(show.images);

  const thumbCandidate = findDefined(
    ...(show.images?.thumb ?? []),
  );

  const runtime = show.runtime ?? NaN;
  const episodeCount = show.aired_episodes ?? NaN;
  const totalRuntime = show.total_runtime ?? (runtime * episodeCount);

  return {
    id: show.ids.trakt,
    key: `show-${show.ids.trakt}`,
    slug: show.ids.slug,
    type: 'show',
    title: show.title,
    originalTitle: show.original_title,
    runtime,
    year: show.year,
    tagline: show.tagline ?? '',
    country: show.country,
    languages: show.languages,
    poster,
    cover,
    logo,
    colors: mapToColors(show.colors?.poster),
    thumb: {
      url: prependHttps(
        findDefined(
          thumbCandidate,
        ),
        cover.url.thumb,
      ),
    },
    genres: show.genres ?? [],
    status: show.status ?? 'unknown',
    overview: show.overview ?? 'TBD',
    trailer: prependHttps(
      show.trailer,
    ),
    airDate: new Date(show.first_aired ?? MAX_DATE),
    certification: show.certification,
    votes: show.votes ?? 0,
    plexSlug: show.ids.plex?.slug,
    postCredits: [],
    episode: {
      count: episodeCount,
    },
    totalRuntime,
    rating: mapToTraktRating(show.rating),
    network: show.network,
    homepage: prependHttps(show.homepage),
    socialMedia: mapToSocialMedia(show),
  };
}
