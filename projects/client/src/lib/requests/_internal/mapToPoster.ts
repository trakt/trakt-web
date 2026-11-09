import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { toMediaImageUrl } from '$lib/utils/url/toMediaImageUrl.ts';
import type { MediaEntry } from '../models/MediaEntry.ts';
import { toMediaImageUrls } from './toMediaImageUrls.ts';

type MapToPosterProps = {
  type: 'movies' | 'shows' | 'seasons';
  id: number;
  images: { poster?: string[] | Nil } | Nil;
};

export function mapToPoster({
  type,
  id,
  images,
}: MapToPosterProps): MediaEntry['poster'] {
  return toMediaImageUrls({
    images,
    candidates: images?.poster,
    toUrl: (size) => toMediaImageUrl({ type, id, slot: 'poster', size }),
    mediumPlaceholder: MEDIA_POSTER_PLACEHOLDER,
    thumbPlaceholder: MEDIA_POSTER_PLACEHOLDER,
  });
}
