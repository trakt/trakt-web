import type { BulkIntlOverlayType } from './BulkIntlOverlayType.ts';

export type BulkIntlTarget<T> = {
  id: number;
  type: BulkIntlOverlayType;
  apply: (entry: T, title: string) => T;
};
