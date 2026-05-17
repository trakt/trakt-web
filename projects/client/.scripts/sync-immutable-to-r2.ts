/**
 * Uploads every file under `.svelte-kit/cloudflare/_app/immutable/` to the
 * `trakt-web-immutable` R2 bucket and writes a release manifest tagging
 * the set of keys this deploy depends on.
 *
 * - Object uploads are additive and skip existing keys (chunks are
 *   content-hashed; same key implies identical bytes).
 * - Each deploy emits one manifest at `releases/<ISO-ts>_<sha>.json`
 *   containing the list of immutable keys that deploy references. This is
 *   what `prune-immutable-r2.ts` walks to decide what to keep.
 *
 * Required env vars:
 *   CLOUDFLARE_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   RELEASE_SHA            (short SHA / tag for the deploy)
 *
 * Optional:
 *   R2_IMMUTABLE_BUCKET    (defaults to `trakt-web-immutable`)
 *   IMMUTABLE_SOURCE_DIR   (defaults to `.svelte-kit/cloudflare`)
 */

import { walk } from '@std/fs/walk';
import { relative } from '@std/path';
import {
  contentTypeFor,
  IMMUTABLE_PREFIX,
  manifestKeyFor,
  r2FromEnv,
  type ReleaseManifest,
} from './_internal/r2.ts';

const SOURCE_DIR = Deno.env.get('IMMUTABLE_SOURCE_DIR') ??
  '.svelte-kit/cloudflare';
const RELEASE_SHA = Deno.env.get('RELEASE_SHA');
const CONCURRENCY = 16;

if (!RELEASE_SHA) {
  console.error('Missing RELEASE_SHA');
  Deno.exit(1);
}

const r2 = r2FromEnv();

async function uploadOne(
  fullPath: string,
  rootDir: string,
): Promise<{ key: string; status: 'uploaded' | 'skipped' }> {
  const key = relative(rootDir, fullPath).replaceAll('\\', '/');

  if (await r2.head(key)) return { key, status: 'skipped' };

  const body = await Deno.readFile(fullPath);
  await r2.put(key, body, {
    'content-type': contentTypeFor(key),
    'cache-control': 'public, immutable, max-age=31536000',
  });
  return { key, status: 'uploaded' };
}

async function main(): Promise<void> {
  const immutableDir = `${SOURCE_DIR}/${IMMUTABLE_PREFIX}`;
  try {
    await Deno.stat(immutableDir);
  } catch {
    console.error(`No immutable assets directory at ${immutableDir}`);
    Deno.exit(1);
  }

  const queue: string[] = [];
  for await (
    const entry of walk(immutableDir, {
      includeDirs: false,
      includeFiles: true,
    })
  ) {
    queue.push(entry.path);
  }

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  const manifestKeys: string[] = [];

  async function worker() {
    while (queue.length) {
      const path = queue.pop();
      if (!path) return;
      try {
        const { key, status } = await uploadOne(path, SOURCE_DIR);
        manifestKeys.push(key);
        if (status === 'uploaded') uploaded++;
        else skipped++;
      } catch (err) {
        failed++;
        console.error(`✗ ${path}: ${(err as Error).message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  console.log(
    `R2 immutable sync: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed.`,
  );

  if (failed > 0) {
    console.error('Skipping manifest write because of upload failures.');
    Deno.exit(1);
  }

  const manifest: ReleaseManifest = {
    sha: RELEASE_SHA!,
    uploadedAt: new Date().toISOString(),
    keys: manifestKeys.sort(),
  };
  const manifestKey = manifestKeyFor(RELEASE_SHA!);
  await r2.put(
    manifestKey,
    new TextEncoder().encode(JSON.stringify(manifest, null, 2)),
    { 'content-type': 'application/json' },
  );
  console.log(
    `R2 manifest written: ${manifestKey} (${manifest.keys.length} keys).`,
  );
}

await main();
