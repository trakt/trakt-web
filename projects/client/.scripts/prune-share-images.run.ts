import { buildTargetPrefixes } from '../src/routes/api/shareable-image/_internal/buildTargetPrefixes.ts';
import { versionedShareImagePrefix } from '../src/routes/api/shareable-image/_internal/versionedShareImagePrefix.ts';
import { time } from '$lib/utils/timing/time.ts';
import { R2Client } from './_internal/r2.ts';
import { pruneShareImages } from './prune-share-images.ts';
import { pruneVersionedShareImages } from './prune-versioned-share-images.ts';

// A full 1000-key page of HEAD requests exhausts sockets and trips rate limits.
const HEAD_CHUNK_SIZE = 50;

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}

const r2 = new R2Client({
  accountId: requireEnv('CLOUDFLARE_ACCOUNT_ID'),
  accessKey: requireEnv('R2_ACCESS_KEY_ID'),
  secretKey: requireEnv('R2_SECRET_ACCESS_KEY'),
  bucket: requireEnv('R2_BUCKET_NAME'),
});

// The S3 list API omits custom metadata, so every key needs its own HEAD.
async function hydrateMetadata(keys: ReadonlyArray<string>) {
  const objects = [];

  for (let i = 0; i < keys.length; i += HEAD_CHUNK_SIZE) {
    const hydrated = await Promise.all(
      keys.slice(i, i + HEAD_CHUNK_SIZE).map(async (key) => ({
        key,
        customMetadata: await r2.headMetadata(key),
      })),
    );
    objects.push(...hydrated);
  }

  return objects;
}

const bucket = {
  list: async (opts?: { cursor?: string; prefix?: string }) => {
    const page = await r2.listPage({
      prefix: opts?.prefix,
      cursor: opts?.cursor,
    });

    return {
      objects: await hydrateMetadata(page.keys),
      truncated: page.cursor !== undefined,
      cursor: page.cursor,
    };
  },
  delete: (key: string) => r2.delete(key),
};

const result = await pruneShareImages(bucket, buildTargetPrefixes());

console.log(
  `Prune complete. deleted: ${result.deleted}, skipped: ${result.skipped}, errors: ${result.errors}`,
);

const versionedBucket = {
  list: async (opts: { cursor?: string; prefix: string }) => {
    const page = await r2.listPage(opts);

    return {
      objects: page.objects,
      truncated: page.cursor !== undefined,
      cursor: page.cursor,
    };
  },
  delete: (key: string) => r2.delete(key),
};

const versionedResult = await pruneVersionedShareImages({
  bucket: versionedBucket,
  targets: [
    {
      ...versionedShareImagePrefix('mir'),
      isLatestOnly: true,
      maxAge: time.days(180),
    },
    {
      ...versionedShareImagePrefix('profile'),
      isLatestOnly: true,
      maxAge: time.days(180),
    },
  ],
  isDryRun: process.env.DRY_RUN === '1',
});

console.log(
  `Versioned prune complete. deleted: ${versionedResult.deleted}, kept: ${versionedResult.kept}, errors: ${versionedResult.errors}`,
);

if (result.errors > 0 || versionedResult.errors > 0) {
  process.exitCode = 1;
}
