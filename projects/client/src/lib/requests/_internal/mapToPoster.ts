import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import type { MediaEntry } from '../models/MediaEntry.ts';
import { toImageUrls } from './toImageUrls.ts';

type Images = {
  poster?: string[];
};

export function mapToPoster(images: Images | Nil): MediaEntry['poster'] {
  return toImageUrls({
    candidates: images?.poster,
    mediumPlaceholder: MEDIA_POSTER_PLACEHOLDER,
    thumbPlaceholder: MEDIA_POSTER_PLACEHOLDER,
  });
}
