/**
 * Prune stale share images from the R2 bucket.
 *
 * Uses the same tiered recheck schedule as the backend:
 *   - First 14 days since release:  recheck every 12 hours
 *   - 15–40 days:                   recheck every 3 days
 *   - 41–120 days:                  recheck every 7 days
 *   - After 120 days:               recheck every 30 days
 *
 * An image is pruned when its `cachedAt` age exceeds the recheck
 * interval for its release age — ensuring freshly-released media
 * gets regenerated frequently while older media is evicted rarely.
 */

import { time } from '$lib/utils/timing/time.ts';

type RecheckTier = {
  maxDaysSinceRelease: number;
  recheckIntervalMs: number;
};

type RecheckSchedule = {
  tiers: RecheckTier[];
  fallbackIntervalMs: number;
};

const SHARE_IMAGE_RECHECK_SCHEDULE: RecheckSchedule = {
  tiers: [
    { maxDaysSinceRelease: 14, recheckIntervalMs: time.hours(12) },
    { maxDaysSinceRelease: 40, recheckIntervalMs: time.days(3) },
    { maxDaysSinceRelease: 120, recheckIntervalMs: time.days(7) },
  ],
  fallbackIntervalMs: time.days(30),
};

function getRecheckIntervalMs(
  daysSinceRelease: number,
  schedule: RecheckSchedule,
): number {
  const tier = schedule.tiers.find(
    (t) => daysSinceRelease <= t.maxDaysSinceRelease,
  );

  return tier?.recheckIntervalMs ?? schedule.fallbackIntervalMs;
}

function isStale(
  cachedAt: number,
  releaseDate: number,
  now: number,
): boolean {
  const daysSinceRelease = (now - releaseDate) / time.days(1);
  const recheckMs = getRecheckIntervalMs(
    daysSinceRelease,
    SHARE_IMAGE_RECHECK_SCHEDULE,
  );
  return now - cachedAt >= recheckMs;
}

type R2Bucket = {
  list: (
    opts?: { cursor?: string; limit?: number; prefix?: string },
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
      const listed = await bucket.list({ cursor, limit: 1000, prefix });

      for (const object of listed.objects) {
        const meta = object.customMetadata ?? {};
        const cachedAt = Number(meta.cachedAt ?? meta.cachedat);
        const releaseDate = Number(meta.releaseDate ?? meta.releasedate);

        if (!cachedAt) {
          result.skipped++;
          continue;
        }

        // Legacy entries (pre-releaseDate metadata) are always pruned so
        // they get regenerated with the full metadata set.
        const shouldDelete = !releaseDate ||
          isStale(cachedAt, releaseDate, now);

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
