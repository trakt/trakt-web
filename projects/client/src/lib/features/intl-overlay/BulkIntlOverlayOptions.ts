import type { BulkIntlTarget } from './BulkIntlTarget.ts';

export type BulkIntlOverlayOptions<T> = {
  getTargets: (entry: T) => ReadonlyArray<BulkIntlTarget<T>>;
};
