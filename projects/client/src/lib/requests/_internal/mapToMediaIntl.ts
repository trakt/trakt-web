import type { TranslationResponse } from '@trakt/api';
import type { MediaIntl } from '../models/MediaIntl.ts';

export function mapToMediaIntl(
  translation: TranslationResponse[0],
): MediaIntl {
  return {
    title: translation.title,
    overview: translation.overview,
    tagline: translation.tagline,
    country: translation.country,
  };
}
