import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { MovieResponse, ShowResponse } from '@trakt/api';
import type { MediaEntry } from '../models/MediaEntry.ts';
import { mediumUrl } from './mediumUrl.ts';
import { thumbUrl } from './thumbUrl.ts';

export function mapToPoster(
  images: ShowResponse['images'] | MovieResponse['images'],
): MediaEntry['poster'] {
  const posterCandidate = findDefined(
    ...(images?.poster ?? []),
  );

  return {
    url: {
      medium: prependHttps(
        mediumUrl(posterCandidate),
        MEDIA_POSTER_PLACEHOLDER,
      ),
      thumb: prependHttps(
        thumbUrl(posterCandidate),
        MEDIA_POSTER_PLACEHOLDER,
      ),
    },
  };
}
