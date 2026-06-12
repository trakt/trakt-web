import type { BulkIntl } from '$lib/requests/models/BulkIntl.ts';
import type { BulkIntlOverlayOptions } from '../BulkIntlOverlayOptions.ts';

export function mergeOverlay<T>(
  entries: ReadonlyArray<T>,
  intl: BulkIntl | Nil,
  opts: BulkIntlOverlayOptions<T>,
): T[] {
  if (!intl) return [...entries];

  return entries.map((entry) => {
    return opts.getTargets(entry).reduce((acc, target) => {
      const title = intl[target.type].get(target.id);
      return title ? target.apply(acc, title) : acc;
    }, entry);
  });
}
