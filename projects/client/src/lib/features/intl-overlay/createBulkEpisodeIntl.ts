import {
  type BulkIntlOverlay,
  createBulkIntlOverlay,
} from './createBulkIntlOverlay.ts';

export function createBulkEpisodeIntl<
  T extends { id: number; title: string },
>(): BulkIntlOverlay<T> {
  return createBulkIntlOverlay<T>({
    getTargets: (entry) => [{
      id: entry.id,
      type: 'episode',
      apply: (acc, title) => ({ ...acc, title }),
    }],
  });
}
