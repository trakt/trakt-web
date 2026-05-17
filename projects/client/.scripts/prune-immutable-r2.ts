/**
 * Prunes the `trakt-web-immutable` R2 bucket so only the most recent N
 * release manifests are retained.
 *
 * Walks every release manifest under `releases/`, sorts by manifest name
 * (ISO-timestamp prefix ⇒ lex-sortable), keeps the newest N, then:
 *   - unions the `keys` arrays from kept manifests → keep_set
 *   - lists every object under `_app/immutable/` and deletes anything not
 *     in keep_set
 *   - deletes the pruned manifests themselves
 *
 * Idempotent. Safe to run on every deploy. Chunks are content-hashed so
 * "kept" releases naturally dedupe identical chunks across deploys.
 *
 * Required env vars:
 *   CLOUDFLARE_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *
 * Optional:
 *   R2_IMMUTABLE_BUCKET   (defaults to `trakt-web-immutable`)
 *   KEEP_RELEASES         (defaults to 10)
 *   DRY_RUN               (set to "1" to log without deleting)
 */

import {
  IMMUTABLE_PREFIX,
  r2FromEnv,
  RELEASE_MANIFEST_PREFIX,
  type ReleaseManifest,
} from './_internal/r2.ts';

const KEEP = Number.parseInt(Deno.env.get('KEEP_RELEASES') ?? '10', 10);
const DRY_RUN = Deno.env.get('DRY_RUN') === '1';

if (!Number.isFinite(KEEP) || KEEP < 1) {
  console.error('KEEP_RELEASES must be a positive integer.');
  Deno.exit(1);
}

const r2 = r2FromEnv();

async function loadManifest(key: string): Promise<ReleaseManifest> {
  const text = await r2.getText(key);
  return JSON.parse(text) as ReleaseManifest;
}

async function main(): Promise<void> {
  const manifests: string[] = [];
  for await (const key of r2.list(RELEASE_MANIFEST_PREFIX)) {
    if (key.endsWith('.json')) manifests.push(key);
  }

  // Manifest keys start with ISO timestamps; lexicographic sort is
  // chronological. Newest at the end.
  manifests.sort();

  if (manifests.length <= KEEP) {
    console.log(
      `R2 prune: ${manifests.length} manifests ≤ KEEP=${KEEP}; nothing to do.`,
    );
    return;
  }

  const keepManifests = manifests.slice(-KEEP);
  const pruneManifests = manifests.slice(0, manifests.length - KEEP);

  const keepKeys = new Set<string>();
  for (const m of keepManifests) {
    try {
      const manifest = await loadManifest(m);
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
    `R2 prune: keep ${keepManifests.length} manifests / ${keepKeys.size} keys; ` +
      `drop ${pruneManifests.length} manifests / ${orphans.length} orphan keys.`,
  );

  if (DRY_RUN) {
    console.log('[dry-run] Skipping deletes.');
    return;
  }

  await r2.deleteMany(orphans);
  await r2.deleteMany(pruneManifests);
  console.log('R2 prune: complete.');
}

await main();
