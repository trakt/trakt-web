import type { SearchResultPosition } from './models/SearchResultPosition.ts';

export function toSearchResultPosition(position: number): SearchResultPosition {
  if (position <= 3) return '1-3';
  if (position <= 10) return '4-10';

  return '11+';
}
