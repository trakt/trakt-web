import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';

type CoverMediaRef = {
  type: ExtendedMediaType;
  id: number;
};

// The cover endpoint only echoes back the image URL, never the media id/type,
// so both are recovered from the id in the path.
const legacyCoverPathPattern =
  /\/images\/(movies|shows|episodes)\/(\d{3})\/(\d{3})\/(\d{3})\//;

const coverPathPattern =
  /\/(movies|shows|episodes)\/(\d+)\/(?:thumb|medium|large|full|original)\//;

const mediaTypeMap: Record<string, ExtendedMediaType> = {
  movies: 'movie',
  shows: 'show',
  episodes: 'episode',
};

function toCoverPathMediaRef(url: string): CoverMediaRef | null {
  const [, urlType, id] = url.match(coverPathPattern) ?? [];
  const type = urlType ? mediaTypeMap[urlType] : undefined;

  if (!type) {
    return null;
  }

  return { type, id: Number(id) };
}

function toLegacyCoverMediaRef(url: string): CoverMediaRef | null {
  const match = url.match(legacyCoverPathPattern);

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

export function toCoverMediaRef(url: string | Nil): CoverMediaRef | null {
  if (!url) {
    return null;
  }

  return toCoverPathMediaRef(url) ?? toLegacyCoverMediaRef(url);
}
