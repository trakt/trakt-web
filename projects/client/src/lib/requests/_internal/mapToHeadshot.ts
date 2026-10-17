import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import type { PersonResponse } from '@trakt/api';
import type { PersonSummary } from '../models/PersonSummary.ts';
import { toImageUrls } from './toImageUrls.ts';

export function mapToHeadshot(
  images: PersonResponse['images'],
): PersonSummary['headshot'] {
  return toImageUrls({
    candidates: images?.headshot,
    mediumPlaceholder: MEDIA_POSTER_PLACEHOLDER,
    thumbPlaceholder: MEDIA_POSTER_PLACEHOLDER,
  });
}
