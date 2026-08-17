import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';

type BuildImageMetadataProps = {
  media: Pick<MediaEntry, 'effectiveReleaseDate'>;
  cachedAt: Date;
};

type ImageMetadata = {
  cachedAt: string;
  releasedAt: string;
};

export function buildImageMetadata(
  { media, cachedAt }: BuildImageMetadataProps,
): ImageMetadata {
  return {
    cachedAt: cachedAt.toISOString(),
    releasedAt: media.effectiveReleaseDate.toISOString(),
  };
}
