import { time } from '$lib/utils/timing/time.ts';

type RecheckTier = {
  maxDaysSinceRelease: number;
  recheckIntervalMs: number;
};

const RECHECK_TIERS: ReadonlyArray<RecheckTier> = [
  { maxDaysSinceRelease: 14, recheckIntervalMs: time.hours(12) },
  { maxDaysSinceRelease: 40, recheckIntervalMs: time.days(3) },
  { maxDaysSinceRelease: 120, recheckIntervalMs: time.days(7) },
];
const FALLBACK_RECHECK_INTERVAL_MS = time.days(30);

function getRecheckIntervalMs(daysSinceRelease: number): number {
  const tier = RECHECK_TIERS.find(
    (t) => daysSinceRelease <= t.maxDaysSinceRelease,
  );

  return tier?.recheckIntervalMs ?? FALLBACK_RECHECK_INTERVAL_MS;
}

function toTimestamp(value: string | undefined): number {
  if (!value) {
    return Number.NaN;
  }

  const parsed = Date.parse(value);

  return Number.isNaN(parsed) ? Number(value) : parsed;
}

type IsStaleProps = {
  cachedAt: number;
  releasedAt: number;
  now: number;
};

function isStale({ cachedAt, releasedAt, now }: IsStaleProps): boolean {
  const daysSinceRelease = (now - releasedAt) / time.days(1);

  return now - cachedAt >= getRecheckIntervalMs(daysSinceRelease);
}

type R2Bucket = {
  list: (
    opts?: { cursor?: string; prefix?: string },
  ) => Promise<{
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
        const shouldDelete = Number.isNaN(releasedAt) ||
          isStale({ cachedAt, releasedAt, now });

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
