import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { shareImagePrefix } from './shareImagePrefix.ts';

type BuildImagePathProps = {
  shareType: ShareType;
  slug: string;
  type: MediaType;
};

export function buildImagePath({ shareType, slug, type }: BuildImagePathProps) {
  return `${shareImagePrefix({ shareType, type })}${slug}/image.png`;
}
