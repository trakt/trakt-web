import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';

type CoverMediaRef = {
  type: ExtendedMediaType;
  id: number;
};

// The cover endpoint only echoes back the image URL, never the media id/type,
// so both are recovered from the zero-padded id in the path.
const coverPathPattern =
  /\/images\/(movies|shows|episodes)\/(\d{3})\/(\d{3})\/(\d{3})\//;

const mediaTypeMap: Record<string, ExtendedMediaType> = {
  movies: 'movie',
  shows: 'show',
  episodes: 'episode',
};

export function toCoverMediaRef(url: string | Nil): CoverMediaRef | null {
  const match = url?.match(coverPathPattern);

  if (!match) {
    return null;
  }

  const [, urlType, high, mid, low] = match;
  const type = urlType ? mediaTypeMap[urlType] : undefined;

  if (!type) {
    return null;
  }

  return { type, id: Number(`${high}${mid}${low}`) };
}
