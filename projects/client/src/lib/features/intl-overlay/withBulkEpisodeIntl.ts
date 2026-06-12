import type { OperatorFunction } from 'rxjs';
import { withBulkIntlOverlay } from './withBulkIntlOverlay.ts';

export function withBulkEpisodeIntl<
  T extends { id: number; title: string },
>(): OperatorFunction<T[], T[]> {
  return withBulkIntlOverlay<T>({
    getTargets: (entry) => [{
      id: entry.id,
      type: 'episode',
      apply: (acc, title) => ({ ...acc, title }),
    }],
  });
}
