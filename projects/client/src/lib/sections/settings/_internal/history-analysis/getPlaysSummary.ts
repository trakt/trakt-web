import type { MediaPlays } from '$lib/requests/models/MediaPlays.ts';

export type PlaysSummary = {
  unique: number;
  total: number;
  duplicates: number;
  duplicateIds: number[];
};

export function getPlaysSummary(
  entries: ReadonlyArray<MediaPlays>,
): PlaysSummary {
  const duplicateIds = entries.flatMap(({ plays }) => {
    if (plays.length <= 1) {
      return [];
    }

    const [, ...olderPlays] = [...plays].sort(
      (a, b) => b.watchedAt.getTime() - a.watchedAt.getTime(),
    );
    return olderPlays.map((play) => play.id);
  });

  const total = entries.reduce((sum, { plays }) => sum + plays.length, 0);

  return {
    unique: entries.length,
    total,
    duplicates: duplicateIds.length,
    duplicateIds,
  };
}
