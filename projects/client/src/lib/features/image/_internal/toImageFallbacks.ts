import {
  EPISODE_COVER_PLACEHOLDER,
  MEDIA_COVER_LARGE_PLACEHOLDER,
  MEDIA_COVER_THUMB_PLACEHOLDER,
  MEDIA_POSTER_PLACEHOLDER,
} from '$lib/utils/assets.ts';

const mediaImagePattern =
  /^(https:\/\/media\.trakt\.tv\/([a-z]+)\/([\d-]+))\/([a-z]+)\/([a-z]+)\.webp(?:\?.*)?$/;

type MediaImagePath = {
  base: string;
  type: string;
  id: string;
  size: string;
  slot: string;
};

function toMediaImagePath(url: string): MediaImagePath | null {
  const [, base, type, id, size, slot] = url.match(mediaImagePattern) ?? [];

  if (!base || !type || !id || !size || !slot) {
    return null;
  }

  return { base, type, id, size, slot };
}

function toCharacterFallbacks({ id, size }: MediaImagePath): string[] {
  const personId = id.split('-').at(1);

  if (!personId) {
    return [MEDIA_POSTER_PLACEHOLDER];
  }

  return [
    `https://media.trakt.tv/people/${personId}/${size}/headshot.webp`,
    MEDIA_POSTER_PLACEHOLDER,
  ];
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

  if (path.type === 'characters') {
    return toCharacterFallbacks(path);
  }

  return toSlotFallbacks(path);
}
