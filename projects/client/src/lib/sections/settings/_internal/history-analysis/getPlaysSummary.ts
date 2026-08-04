import type { MediaPlays } from '$lib/requests/models/MediaPlays.ts';
import type { PlayRetention } from './PlayRetention.ts';

export type PlaysSummary = {
  unique: number;
  total: number;
  duplicates: number;
  duplicateIds: number[];
};

type GetPlaysSummaryProps = {
  entries: ReadonlyArray<MediaPlays>;
  keep: PlayRetention;
};

export function getPlaysSummary(
  { entries, keep }: GetPlaysSummaryProps,
): PlaysSummary {
  const duplicateIds = entries.flatMap(({ plays }) => {
    if (plays.length <= 1) {
      return [];
    }

    const chronological = [...plays].sort(
      (a, b) => a.watchedAt.getTime() - b.watchedAt.getTime(),
    );
    const removable = keep === 'oldest'
      ? chronological.slice(1)
      : chronological.slice(0, -1);

    return removable.map((play) => play.id);
  });

  const total = entries.reduce((sum, { plays }) => sum + plays.length, 0);

  return {
    unique: entries.length,
    total,
    duplicates: duplicateIds.length,
    duplicateIds,
  };
}
