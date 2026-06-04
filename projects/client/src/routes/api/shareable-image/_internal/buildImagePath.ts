import {
  SHARE_TYPE_DIMENSIONS,
  type ShareType,
} from '$lib/features/share/models/ShareType.ts';
import {
  type MediaType,
  MediaTypeSchema,
} from '$lib/requests/models/MediaType.ts';

const rootPath = 'images';

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

  return `${rootPath}/${shareTypePath}/${mediaPath}/image.png`;
}

export function buildTargetPrefixes(): ReadonlyArray<string> {
  const shareTypes = Object.keys(SHARE_TYPE_DIMENSIONS) as ShareType[];
  const mediaTypes = MediaTypeSchema.options;

  return shareTypes.flatMap((shareType) =>
    mediaTypes.map((type) =>
      `${rootPath}/${toShareTypePath(shareType)}/${type}/`
    )
  );
}
