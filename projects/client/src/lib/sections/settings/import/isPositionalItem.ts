import type { UniversalImportItem } from './ImportTypes.ts';

export function isPositionalItem(
  item: UniversalImportItem,
): item is UniversalImportItem & { season: number; episode: number } {
  return (
    (item.showTvdb != null || item.showImdb != null) &&
    item.season != null &&
    item.episode != null
  );
}
