import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MAX_MIXTAPE_PICKS } from './MAX_MIXTAPE_PICKS.ts';

type MixtapeParams = {
  type: MediaType;
  picks: number[];
  skips: number[];
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

export function parseMixtapeParams(
  searchParams: URLSearchParams,
): MixtapeParams {
  const picks = toIds(searchParams.get('picks')).slice(0, MAX_MIXTAPE_PICKS);

  return {
    type: searchParams.get('type') === 'show' ? 'show' : 'movie',
    picks,
    skips: toIds(searchParams.get('skips')),
    view: searchParams.get('view') === 'results' && picks.length > 0
      ? 'results'
      : 'pick',
    source: searchParams.get('source'),
  };
}
