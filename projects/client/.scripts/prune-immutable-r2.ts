/**
 * Prunes the `trakt-web-immutable` R2 bucket so retention covers both a
 * minimum **count** and a minimum **age** of recent deploys.
 *
 * Retention rule (union of two windows):
 *   1. KEEP_RELEASES newest manifests by count (default 10)
 *   2. Every manifest younger than MIN_AGE_HOURS (default 24)
 *
 * The union handles two common patterns without manual tuning:
 *   - Slow week (1 deploy / day): rule 1 dominates, ~10 days retained.
 *   - Deploy burst (15 in one day): rule 2 dominates, every deploy of
 *     the past day is retained even though count > KEEP_RELEASES, so
 *     long-lived SPA tabs can still recover their stale chunks.
 *
 * Walks every kept manifest, unions the `keys` arrays into a keep_set,
 * then deletes anything under `_app/immutable/` not in keep_set plus
 * any manifest that falls outside both windows.
 *
 * Idempotent. Safe to run on every deploy.
 *
 * Required env vars:
 *   CLOUDFLARE_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *
 * Optional:
 *   R2_IMMUTABLE_BUCKET   (defaults to `trakt-web-immutable`)
 *   KEEP_RELEASES         (defaults to 10)
 *   MIN_AGE_HOURS         (defaults to 24)
 *   DRY_RUN               (set to "1" to log without deleting)
 */

import {
  IMMUTABLE_PREFIX,
  manifestKeyToDate,
  r2FromEnv,
  RELEASE_MANIFEST_PREFIX,
  type ReleaseManifest,
} from './_internal/r2.ts';

export function selectKeepManifests(
  manifests: string[],
  now: Date,
  keep: number,
  minAgeHours: number,
): { keep: string[]; prune: string[] } {
  // Only manifests whose key parses as an ISO timestamp participate in the
  // retention windows. Stray objects (manual uploads, partial writes) are
  // always pruned — they have no provenance we trust.
  const dated = manifests
    .map((key) => ({ key, date: manifestKeyToDate(key) }))
    .filter((m): m is { key: string; date: Date } => m.date !== null);

  // Manifest keys start with ISO timestamps; lex sort is chronological,
  // but sort by parsed date to be explicit.
  dated.sort((a, b) => a.date.getTime() - b.date.getTime());

  const cutoff = new Date(now.getTime() - minAgeHours * 60 * 60 * 1000);
  const keepSet = new Set<string>();

  // Rule 1: count-based — last KEEP entries.
  for (const m of dated.slice(-keep)) keepSet.add(m.key);

  // Rule 2: age-based — anything newer than cutoff.
  for (const m of dated) {
    if (m.date.getTime() > cutoff.getTime()) keepSet.add(m.key);
  }

  const sortedKeys = manifests.slice().sort();
  const keepList = sortedKeys.filter((k) => keepSet.has(k));
  const pruneList = sortedKeys.filter((k) => !keepSet.has(k));
  return { keep: keepList, prune: pruneList };
}

async function loadManifest(
  r2: ReturnType<typeof r2FromEnv>,
  key: string,
): Promise<ReleaseManifest> {
  const text = await r2.getText(key);
  return JSON.parse(text) as ReleaseManifest;
}

async function main(): Promise<void> {
  const KEEP = Number.parseInt(Deno.env.get('KEEP_RELEASES') ?? '10', 10);
  const MIN_AGE_HOURS = Number.parseInt(
    Deno.env.get('MIN_AGE_HOURS') ?? '24',
    10,
  );
  const DRY_RUN = Deno.env.get('DRY_RUN') === '1';

  if (!Number.isFinite(KEEP) || KEEP < 1) {
    console.error('KEEP_RELEASES must be a positive integer.');
    Deno.exit(1);
  }
  if (!Number.isFinite(MIN_AGE_HOURS) || MIN_AGE_HOURS < 0) {
    console.error('MIN_AGE_HOURS must be a non-negative integer.');
    Deno.exit(1);
  }

  const r2 = r2FromEnv();

  const manifests: string[] = [];
  for await (const key of r2.list(RELEASE_MANIFEST_PREFIX)) {
    if (key.endsWith('.json')) manifests.push(key);
  }

  const now = new Date();
  const { keep: keepManifests, prune: pruneManifests } = selectKeepManifests(
    manifests,
    now,
    KEEP,
    MIN_AGE_HOURS,
  );

  console.log(
    `R2 prune: ${manifests.length} manifests total; ` +
      `keeping ${keepManifests.length} ` +
      `(count window=${KEEP}, age window=${MIN_AGE_HOURS}h).`,
  );

  if (pruneManifests.length === 0) {
    console.log('R2 prune: nothing to do.');
    return;
  }

  const keepKeys = new Set<string>();
  for (const m of keepManifests) {
    try {
      const manifest = await loadManifest(r2, m);
      for (const k of manifest.keys) keepKeys.add(k);
    } catch (err) {
      console.error(
        `✗ failed to load manifest ${m}: ${(err as Error).message}`,
      );
      console.error('Aborting prune to avoid deleting live keys.');
      Deno.exit(1);
    }
  }

  const orphans: string[] = [];
  for await (const key of r2.list(IMMUTABLE_PREFIX)) {
    if (!keepKeys.has(key)) orphans.push(key);
  }

  console.log(
    `R2 prune: drop ${pruneManifests.length} manifests / ${orphans.length} ` +
      `orphan keys (keep_set has ${keepKeys.size} keys).`,
  );

  if (DRY_RUN) {
    console.log('[dry-run] Skipping deletes.');
    return;
  }

  await r2.deleteMany(orphans);
  await r2.deleteMany(pruneManifests);
  console.log('R2 prune: complete.');
}

if (import.meta.main) {
  await main();
}
