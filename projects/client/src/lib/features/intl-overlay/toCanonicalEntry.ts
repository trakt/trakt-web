import { CANONICAL_ENTRY } from './_internal/canonicalEntry.ts';

/**
 * Reads the untranslated entry stashed by `mergeOverlay`, falling back to the
 * entry itself when no overlay was applied.
 */
export function toCanonicalEntry<T>(entry: T): T {
  if (typeof entry !== 'object' || entry == null) return entry;

  const canonical = (entry as { [CANONICAL_ENTRY]?: T })[CANONICAL_ENTRY];
  return canonical ?? entry;
}
