import {
  MEDIA_COVER_LARGE_PLACEHOLDER,
  MEDIA_COVER_THUMB_PLACEHOLDER,
} from '$lib/utils/assets.ts';
import { toMediaImageUrl } from '$lib/utils/url/toMediaImageUrl.ts';
import type { MovieResponse, ShowResponse } from '@trakt/api';
import type { MediaEntry } from '../models/MediaEntry.ts';
import { toMediaImageUrls } from './toMediaImageUrls.ts';

type MapToCoverProps = {
  type: 'movies' | 'shows';
  id: number;
  images: ShowResponse['images'] | MovieResponse['images'];
};

export function mapToCover({
  type,
  id,
  images,
}: MapToCoverProps): MediaEntry['cover'] {
  return toMediaImageUrls({
    images,
    candidates: images?.fanart,
    toUrl: (size) => toMediaImageUrl({ type, id, slot: 'fanart', size }),
    mediumPlaceholder: MEDIA_COVER_LARGE_PLACEHOLDER,
    thumbPlaceholder: MEDIA_COVER_THUMB_PLACEHOLDER,
  });
}
