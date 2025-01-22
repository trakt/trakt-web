import {
  MEDIA_COVER_LARGE_PLACEHOLDER,
  MEDIA_COVER_THUMB_PLACEHOLDER,
} from '$lib/utils/constants';
import { findDefined } from '$lib/utils/string/findDefined';
import { prependHttps } from '$lib/utils/url/prependHttps';
import type { MovieResponse, ShowResponse } from '@trakt/api';
import type { MediaEntry } from '../models/MediaEntry';
import { mediumUrl } from './mediumUrl';
import { thumbUrl } from './thumbUrl';

export function mapCover(
  images: ShowResponse['images'] | MovieResponse['images'],
): MediaEntry['cover'] {
  const coverCandidate = findDefined(...(images?.fanart ?? []));

  return {
    url: {
      medium: prependHttps(
        mediumUrl(coverCandidate),
        MEDIA_COVER_LARGE_PLACEHOLDER,
      ),
      thumb: prependHttps(
        thumbUrl(coverCandidate),
        MEDIA_COVER_THUMB_PLACEHOLDER,
      ),
    },
  };
}
