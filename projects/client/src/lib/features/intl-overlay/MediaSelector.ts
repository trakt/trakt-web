import type { BulkIntlOverlayType } from './BulkIntlOverlayType.ts';

/**
 * Describes one localizable media slot inside an entry shape:
 * `get` returns the slot's bulk-intl id and type, or null when this
 * selector does not apply to the entry. `patch` rewrites the slot's
 * title in an immutable copy of the entry.
 */
export type MediaSelector<T> = {
  get: (entry: T) => { id: number; type: BulkIntlOverlayType } | null;
  patch: (entry: T, title: string) => T;
};
