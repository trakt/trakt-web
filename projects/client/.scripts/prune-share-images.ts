import { shareImageTimeToLive } from '../src/routes/api/shareable-image/_internal/shareImageTimeToLive.ts';

function toTimestamp(value: string | undefined): number {
  if (!value) {
    return Number.NaN;
  }

  const parsed = Date.parse(value);

  return Number.isNaN(parsed) ? Number(value) : parsed;
}

type R2Bucket = {
  list: (opts?: { cursor?: string; prefix?: string }) => Promise<{
    objects: Array<{
      key: string;
      customMetadata?: Record<string, string>;
    }>;
    truncated: boolean;
    cursor?: string;
  }>;
  delete: (key: string) => Promise<void>;
};

type PruneResult = {
  deleted: number;
  skipped: number;
  errors: number;
};

export async function pruneShareImages(
  bucket: R2Bucket,
  prefixes: ReadonlyArray<string>,
): Promise<PruneResult> {
  const now = Date.now();
  const result: PruneResult = { deleted: 0, skipped: 0, errors: 0 };

  for (const prefix of prefixes) {
    let cursor: string | undefined;

    do {
      const listed = await bucket.list({ cursor, prefix });

      for (const object of listed.objects) {
        const meta = object.customMetadata ?? {};
        const cachedAt = toTimestamp(meta.cachedAt ?? meta.cachedat);
        const releasedAt = toTimestamp(meta.releasedAt ?? meta.releasedat);

        if (Number.isNaN(cachedAt)) {
          result.skipped++;
          continue;
        }

        // Entries predating `releasedAt` get rewritten with full metadata.
        const shouldDelete =
          Number.isNaN(releasedAt) ||
          shareImageTimeToLive({ cachedAt, releasedAt, now }) <= 0;

        if (!shouldDelete) {
          result.skipped++;
          continue;
        }

        try {
          await bucket.delete(object.key);
          result.deleted++;
        } catch {
          result.errors++;
        }
      }

      cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);
  }
  return result;
}
