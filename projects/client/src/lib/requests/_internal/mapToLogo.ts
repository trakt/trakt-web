import {
  MEDIA_COVER_LARGE_PLACEHOLDER,
  MEDIA_COVER_THUMB_PLACEHOLDER,
} from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { MovieResponse, ShowResponse } from '@trakt/api';
import type { MediaEntry } from '../models/MediaEntry.ts';
import { mediumUrl } from './mediumUrl.ts';
import { thumbUrl } from './thumbUrl.ts';

export function mapToLogo(
  images: ShowResponse['images'] | MovieResponse['images'],
): MediaEntry['cover'] {
  const logoCandidate = findDefined(...(images?.logo ?? []));

  return {
    url: {
      medium: prependHttps(
        mediumUrl(logoCandidate),
        MEDIA_COVER_LARGE_PLACEHOLDER,
      ),
      thumb: prependHttps(
        thumbUrl(logoCandidate),
        MEDIA_COVER_THUMB_PLACEHOLDER,
      ),
    },
  };
}
