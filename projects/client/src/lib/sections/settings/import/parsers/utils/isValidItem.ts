import type { ImportType, UniversalImportItem } from '../../ImportTypes.ts';
import { isPositionalItem } from '../../isPositionalItem.ts';
import {
  type IdPriority,
  MOVIE_IDS,
  pickIds,
  SEASON_IDS,
  SHOW_IDS,
  toEpisodeIdPriority,
} from '../../engine/pickIds.ts';

const PRIORITY_BY_TYPE: Record<
  ImportType,
  (item: UniversalImportItem) => IdPriority
> = {
  movie: () => MOVIE_IDS,
  show: () => SHOW_IDS,
  season: () => SEASON_IDS,
  episode: toEpisodeIdPriority,
};

// An id its type cannot resolve by is no better than no id at all: the item
// would sail through review, inflate the imported count and never reach a
// payload. Seasons carrying only an imdb id are the common case.
export function isValidItem(item: UniversalImportItem): boolean {
  const hasUsableId =
    pickIds(item.ids, PRIORITY_BY_TYPE[item.type](item)) != null;
  const hasTitleAndYear = Boolean(item.title) && Boolean(item.year);

  return hasUsableId || hasTitleAndYear || isPositionalItem(item);
}
