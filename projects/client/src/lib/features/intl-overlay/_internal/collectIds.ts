import { BULK_INTL_ID_CAP } from '$lib/requests/queries/intl/bulkIntlQuery.ts';
import type { BulkIntlOverlayOptions } from '../BulkIntlOverlayOptions.ts';
import type { CollectedIds } from './CollectedIds.ts';

export function collectIds<T>(
  entries: ReadonlyArray<T>,
  opts: BulkIntlOverlayOptions<T>,
): CollectedIds {
  const movieIds = new Set<number>();
  const showIds = new Set<number>();
  const episodeIds = new Set<number>();

  for (const entry of entries) {
    for (const target of opts.getTargets(entry)) {
      switch (target.type) {
        case 'movie':
          movieIds.add(target.id);
          break;
        case 'show':
          showIds.add(target.id);
          break;
        case 'episode':
          episodeIds.add(target.id);
          break;
      }
    }
  }

  const cap = (set: Set<number>) =>
    [...set].sort((a, b) => a - b).slice(0, BULK_INTL_ID_CAP);

  return {
    movieIds: cap(movieIds),
    showIds: cap(showIds),
    episodeIds: cap(episodeIds),
  };
}
