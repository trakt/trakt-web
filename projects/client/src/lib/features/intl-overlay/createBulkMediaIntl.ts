import type { BulkIntlOverlayType } from './BulkIntlOverlayType.ts';
import {
  type BulkIntlOverlay,
  createBulkIntlOverlay,
} from './createBulkIntlOverlay.ts';

export function createBulkMediaIntl<
  T extends { id: number; type: BulkIntlOverlayType; title: string },
>(): BulkIntlOverlay<T> {
  return createBulkIntlOverlay<T>({
    getTargets: (entry) => [{
      id: entry.id,
      type: entry.type,
      apply: (acc, title) => ({ ...acc, title }),
    }],
  });
}
