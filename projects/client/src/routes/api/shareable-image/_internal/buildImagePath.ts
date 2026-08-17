import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

const ROOT_PATH = 'images/share';

type BuildImagePathProps = {
  shareType: ShareType;
  slug: string;
  type: MediaType;
};

function toShareTypePath(shareType: ShareType): string {
  switch (shareType) {
    case 'open-graph':
      return 'og';
    case 'feed':
      return 'feed';
    case 'story':
      return 'story';
  }
}

function toMediaPath(type: MediaType, slug: string): string {
  switch (type) {
    case 'movie':
      return `movie/${slug}`;
    case 'show':
      return `show/${slug}`;
  }
}

export function buildImagePath({ shareType, slug, type }: BuildImagePathProps) {
  const shareTypePath = toShareTypePath(shareType);
  const mediaPath = toMediaPath(type, slug);

  return `${ROOT_PATH}/${shareTypePath}/${mediaPath}/image.png`;
}
