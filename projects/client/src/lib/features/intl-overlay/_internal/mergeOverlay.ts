import type { BulkIntl } from '$lib/requests/models/BulkIntl.ts';
import type { BulkIntlOverlayOptions } from '../BulkIntlOverlayOptions.ts';
import { CANONICAL_ENTRY } from './canonicalEntry.ts';

/**
 * Non-enumerable so the stashed entry stays out of spreads, serialization and
 * structural comparisons.
 */
function defineCanonicalEntry<T>(overlaid: T, canonical: T): T {
  return Object.defineProperty(overlaid as object, CANONICAL_ENTRY, {
    value: canonical,
    enumerable: false,
  }) as T;
}

export function mergeOverlay<T>(
  entries: ReadonlyArray<T>,
  intl: BulkIntl | Nil,
  opts: BulkIntlOverlayOptions<T>,
): T[] {
  if (!intl) return [...entries];

  return entries.map((entry) => {
    const overlaid = opts.getTargets(entry).reduce((acc, target) => {
      const title = intl[target.type].get(target.id);
      return title ? target.apply(acc, title) : acc;
    }, entry);

    if (overlaid === entry) return entry;

    return defineCanonicalEntry(overlaid, entry);
  });
}
