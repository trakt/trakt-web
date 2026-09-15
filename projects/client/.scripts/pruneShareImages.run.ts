import { buildTargetPrefixes } from '../src/routes/api/shareable-image/_internal/buildTargetPrefixes.ts';
import { R2Client } from './_internal/r2.ts';
import { pruneShareImages } from './pruneShareImages.ts';

// A full 1000-key page of HEAD requests exhausts sockets and trips rate limits.
const HEAD_CHUNK_SIZE = 50;

function requireEnv(name: string): string {
  const value = Deno.env.get(name);

  if (!value) {
    console.error(`Missing required env var: ${name}`);
    Deno.exit(1);
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

if (result.errors > 0) {
  Deno.exit(1);
}
