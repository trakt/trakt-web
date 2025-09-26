import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { PersonResponse } from '@trakt/api';
import type { PersonSummary } from '../models/PersonSummary.ts';
import { mediumUrl } from './mediumUrl.ts';
import { thumbUrl } from './thumbUrl.ts';

export function mapToHeadshot(
  images: PersonResponse['images'],
): PersonSummary['headshot'] {
  const headshotCandidate = findDefined(...(images?.headshot ?? []));

  return {
    url: {
      medium: prependHttps(
        mediumUrl(headshotCandidate),
        MEDIA_POSTER_PLACEHOLDER,
      ),
      thumb: prependHttps(
        thumbUrl(headshotCandidate),
        MEDIA_POSTER_PLACEHOLDER,
      ),
    },
  };
}
