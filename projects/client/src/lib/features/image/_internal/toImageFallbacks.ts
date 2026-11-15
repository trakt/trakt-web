import {
  EPISODE_COVER_PLACEHOLDER,
  MEDIA_COVER_LARGE_PLACEHOLDER,
  MEDIA_COVER_THUMB_PLACEHOLDER,
  MEDIA_POSTER_PLACEHOLDER,
} from '$lib/utils/assets.ts';

const mediaImagePattern =
  /^(https:\/\/media\.trakt\.tv\/[a-z]+\/\d+)\/([a-z]+)\/([a-z]+)\.webp(?:\?.*)?$/;

type MediaImagePath = {
  base: string;
  size: string;
  slot: string;
};

function toMediaImagePath(url: string): MediaImagePath | null {
  const [, base, size, slot] = url.match(mediaImagePattern) ?? [];

  if (!base || !size || !slot) {
    return null;
  }

  return { base, size, slot };
}

function toCoverPlaceholder(size: string) {
  return size === 'thumb'
    ? MEDIA_COVER_THUMB_PLACEHOLDER
    : MEDIA_COVER_LARGE_PLACEHOLDER;
}

function toSlotFallbacks({ base, size, slot }: MediaImagePath): string[] {
  switch (slot) {
    case 'poster':
    case 'headshot':
      return [MEDIA_POSTER_PLACEHOLDER];
    case 'screenshot':
      return [EPISODE_COVER_PLACEHOLDER];
    case 'fanart':
      return [toCoverPlaceholder(size)];
    case 'thumb':
      return [`${base}/thumb/fanart.webp`, MEDIA_COVER_THUMB_PLACEHOLDER];
    default:
      return [];
  }
}

export function toImageFallbacks(url: string): string[] {
  const path = toMediaImagePath(url);

  if (!path) {
    return [];
  }

  return toSlotFallbacks(path);
}
