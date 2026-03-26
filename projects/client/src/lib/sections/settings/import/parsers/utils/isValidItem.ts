import type { UniversalImportItem } from '../../ImportTypes.ts';

export function isValidItem(item: UniversalImportItem): boolean {
  const hasId = Boolean(item.ids.trakt) ||
    Boolean(item.ids.imdb) ||
    Boolean(item.ids.tmdb) ||
    Boolean(item.ids.tvdb);

  const hasTitleAndYear = Boolean(item.title) && Boolean(item.year);

  return hasId || hasTitleAndYear;
}
