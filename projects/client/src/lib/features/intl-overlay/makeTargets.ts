import type { BulkIntlTarget } from './BulkIntlTarget.ts';
import type { MediaSelector } from './MediaSelector.ts';

/**
 * Composes a `getTargets` function from a flat list of MediaSelectors.
 * Each selector contributes a target whenever its `get` returns a non-null
 * reference, so a single entry can carry localizable titles in several
 * slots (e.g. show + episode) without the caller hand-rolling per-target
 * narrowing.
 */
export function makeTargets<T>(
  ...selectors: ReadonlyArray<MediaSelector<T>>
): (entry: T) => ReadonlyArray<BulkIntlTarget<T>> {
  return (entry) => {
    const targets: BulkIntlTarget<T>[] = [];

    for (const selector of selectors) {
      const ref = selector.get(entry);
      if (!ref) continue;

      targets.push({
        id: ref.id,
        type: ref.type,
        apply: selector.patch,
      });
    }

    return targets;
  };
}
