import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants';
import { findDefined } from '$lib/utils/string/findDefined';
import { prependHttps } from '$lib/utils/url/prependHttps';
import type { MovieResponse, ShowResponse } from '@trakt/api';
import type { MediaSummary } from '../models/MediaSummary';
import { mediumUrl } from './mediumUrl';
import { thumbUrl } from './thumbUrl';

export function mapPoster(
  images: ShowResponse['images'] | MovieResponse['images'],
): MediaSummary['poster'] {
  const posterCandidate = findDefined(
    images?.poster.at(1),
    images?.poster.at(0),
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
