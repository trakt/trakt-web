import type { CollectedIds } from './CollectedIds.ts';

export function idsEqual(a: CollectedIds, b: CollectedIds): boolean {
  return (
    a.movieIds.length === b.movieIds.length &&
    a.showIds.length === b.showIds.length &&
    a.episodeIds.length === b.episodeIds.length &&
    a.movieIds.every((id, i) => id === b.movieIds[i]) &&
    a.showIds.every((id, i) => id === b.showIds[i]) &&
    a.episodeIds.every((id, i) => id === b.episodeIds[i])
  );
}
