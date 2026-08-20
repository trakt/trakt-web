import type { ImportIds } from '../../ImportTypes.ts';

type RawId = string | number | null | undefined;

type RawImportIds = {
  trakt?: RawId;
  imdb?: RawId;
  tmdb?: RawId;
  tvdb?: RawId;
};

function toNumericId(value: RawId): number | undefined {
  const parsed = typeof value === 'number'
    ? value
    : Number.parseInt(String(value ?? '').trim(), 10);

  if (!Number.isInteger(parsed) || parsed <= 0) return undefined;
  return parsed;
}

function toTextId(value: RawId): string | undefined {
  if (typeof value !== 'string') return undefined;
  return value.trim() || undefined;
}

export function toImportIds(ids: RawImportIds): ImportIds {
  return {
    trakt: toNumericId(ids.trakt),
    imdb: toTextId(ids.imdb),
    tmdb: toNumericId(ids.tmdb),
    tvdb: toNumericId(ids.tvdb),
  };
}
