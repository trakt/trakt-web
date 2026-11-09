import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { toMediaImageUrl } from '$lib/utils/url/toMediaImageUrl.ts';
import type { PersonResponse } from '@trakt/api';
import type { PersonSummary } from '../models/PersonSummary.ts';
import { toMediaImageUrls } from './toMediaImageUrls.ts';

type MapToHeadshotProps = {
  id: number;
  images: PersonResponse['images'];
};

export function mapToHeadshot({
  id,
  images,
}: MapToHeadshotProps): PersonSummary['headshot'] {
  return toMediaImageUrls({
    images,
    candidates: images?.headshot,
    toUrl: (size) =>
      toMediaImageUrl({ type: 'people', id, slot: 'headshot', size }),
    mediumPlaceholder: MEDIA_POSTER_PLACEHOLDER,
    thumbPlaceholder: MEDIA_POSTER_PLACEHOLDER,
  });
}
