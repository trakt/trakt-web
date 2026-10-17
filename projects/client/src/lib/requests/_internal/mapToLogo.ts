import {
  MEDIA_COVER_LARGE_PLACEHOLDER,
  MEDIA_COVER_THUMB_PLACEHOLDER,
} from '$lib/utils/assets.ts';
import type { MovieResponse, ShowResponse } from '@trakt/api';
import type { MediaEntry } from '../models/MediaEntry.ts';
import { toImageUrls } from './toImageUrls.ts';

export function mapToLogo(
  images: ShowResponse['images'] | MovieResponse['images'],
): MediaEntry['cover'] {
  return toImageUrls({
    candidates: images?.logo,
    mediumPlaceholder: MEDIA_COVER_LARGE_PLACEHOLDER,
    thumbPlaceholder: MEDIA_COVER_THUMB_PLACEHOLDER,
  });
}
