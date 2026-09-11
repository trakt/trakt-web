import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

const ROOT_PATH = 'images/share';

type ShareImagePrefixProps = {
  shareType: ShareType;
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

export function shareImagePrefix(
  { shareType, type }: ShareImagePrefixProps,
): string {
  return `${ROOT_PATH}/${toShareTypePath(shareType)}/${type}/`;
}
