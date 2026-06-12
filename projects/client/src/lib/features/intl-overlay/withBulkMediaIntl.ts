import type { OperatorFunction } from 'rxjs';
import type { BulkIntlOverlayType } from './BulkIntlOverlayType.ts';
import { withBulkIntlOverlay } from './withBulkIntlOverlay.ts';

export function withBulkMediaIntl<
  T extends { id: number; type: BulkIntlOverlayType; title: string },
>(): OperatorFunction<T[], T[]> {
  return withBulkIntlOverlay<T>({
    getTargets: (entry) => [{
      id: entry.id,
      type: entry.type,
      apply: (acc, title) => ({ ...acc, title }),
    }],
  });
}
