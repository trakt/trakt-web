import {
  EPISODE_COVER_PLACEHOLDER,
  MEDIA_COVER_LARGE_PLACEHOLDER,
  MEDIA_COVER_THUMB_PLACEHOLDER,
  MEDIA_POSTER_PLACEHOLDER,
} from '$lib/utils/assets.ts';
import { toMediaImageUrl } from '$lib/utils/url/toMediaImageUrl.ts';

const mediaImagePattern =
  /^(https:\/\/media\.trakt\.tv\/[a-z]+\/(?:\d+|(?:show|movie)-\d+(?:-s\d+)?-(\d+)))\/([a-z]+)\/([a-z]+)\.webp(?:\?.*)?$/;

const seasonSegmentPattern = /-s\d+(?=-\d+$)/;

type MediaImagePath = {
  base: string;
  size: string;
  slot: string;
  personId?: string;
};

function toMediaImagePath(url: string): MediaImagePath | null {
  const [, base, personId, size, slot] = url.match(mediaImagePattern) ?? [];

  if (!base || !size || !slot) {
    return null;
  }

  return { base, size, slot, personId };
}

function toCoverPlaceholder(size: string) {
  return size === 'thumb'
    ? MEDIA_COVER_THUMB_PLACEHOLDER
    : MEDIA_COVER_LARGE_PLACEHOLDER;
}

function toPortraitFallbacks(
  base: string,
  size: string,
  personId: string | undefined,
) {
  if (!personId) {
    return [MEDIA_POSTER_PLACEHOLDER];
  }

  const headshot = toMediaImageUrl({
    type: 'people',
    id: Number(personId),
    slot: 'headshot',
    size: size === 'thumb' ? 'thumb' : 'medium',
  });
  const showPortraitBase = base.replace(seasonSegmentPattern, '');

  if (showPortraitBase === base) {
    return [headshot, MEDIA_POSTER_PLACEHOLDER];
  }

  return [
    `${showPortraitBase}/${size}/portrait.webp`,
    headshot,
    MEDIA_POSTER_PLACEHOLDER,
  ];
}

function toSlotFallbacks({
  base,
  size,
  slot,
  personId,
}: MediaImagePath): string[] {
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
    case 'portrait':
      return toPortraitFallbacks(base, size, personId);
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
