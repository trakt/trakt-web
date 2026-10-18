import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MAX_MIXTAPE_PICKS } from './MAX_MIXTAPE_PICKS.ts';

type MixtapeParams = {
  type: MediaType;
  picks: number[];
  skips: number[];
  kept: number[][];
  savedTo: number | null;
  view: 'pick' | 'results';
  source: string | null;
};

function toIds(raw: string | null): number[] {
  const ids = (raw ?? '')
    .split(',')
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0);
  return [...new Set(ids)];
}

const ROUND_SEPARATOR = '~';

function toRounds(raw: string | null): number[][] {
  if (raw == null) return [];
  return raw.split(ROUND_SEPARATOR).map(toIds);
}

function toListId(raw: string | null): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function parseMixtapeParams(
  searchParams: URLSearchParams,
): MixtapeParams {
  const picks = toIds(searchParams.get('picks')).slice(0, MAX_MIXTAPE_PICKS);

  return {
    type: searchParams.get('type') === 'show' ? 'show' : 'movie',
    picks,
    skips: toIds(searchParams.get('skips')),
    kept: toRounds(searchParams.get('kept')),
    savedTo: toListId(searchParams.get('to')),
    view:
      searchParams.get('view') === 'results' && picks.length > 0
        ? 'results'
        : 'pick',
    source: searchParams.get('source'),
  };
}
