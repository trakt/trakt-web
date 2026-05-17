/**
 * Uploads every file under `.svelte-kit/cloudflare/_app/immutable/` to the
 * `trakt-web-immutable` R2 bucket, additively. Existing keys are skipped
 * (chunks are content-hashed; same key implies identical bytes).
 *
 * Required env vars:
 *   CLOUDFLARE_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *
 * Optional:
 *   R2_IMMUTABLE_BUCKET   (defaults to `trakt-web-immutable`)
 *   IMMUTABLE_SOURCE_DIR  (defaults to `.svelte-kit/cloudflare`)
 *
 * Intended to run in CI between build and deploy. Failures are non-fatal
 * for the deploy itself but should be alerted on so the retention pool
 * does not silently degrade.
 */

import { walk } from '@std/fs/walk';
import { relative } from '@std/path';

const ACCOUNT_ID = Deno.env.get('CLOUDFLARE_ACCOUNT_ID');
const ACCESS_KEY = Deno.env.get('R2_ACCESS_KEY_ID');
const SECRET_KEY = Deno.env.get('R2_SECRET_ACCESS_KEY');
const BUCKET = Deno.env.get('R2_IMMUTABLE_BUCKET') ?? 'trakt-web-immutable';
const SOURCE_DIR = Deno.env.get('IMMUTABLE_SOURCE_DIR') ??
  '.svelte-kit/cloudflare';
const CONCURRENCY = 16;

if (!ACCOUNT_ID || !ACCESS_KEY || !SECRET_KEY) {
  console.error(
    'Missing CLOUDFLARE_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY',
  );
  Deno.exit(1);
}

const endpoint = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;
const region = 'auto';
const service = 's3';

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  js: 'text/javascript; charset=utf-8',
  mjs: 'text/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  map: 'application/json; charset=utf-8',
  json: 'application/json; charset=utf-8',
  svg: 'image/svg+xml',
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  ico: 'image/x-icon',
};

function contentTypeFor(key: string): string {
  const ext = key.split('.').pop()?.toLowerCase() ?? '';
  return CONTENT_TYPE_BY_EXT[ext] ?? 'application/octet-stream';
}

async function sha256Hex(data: Uint8Array | string): Promise<string> {
  const buf = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmac(
  key: ArrayBuffer | Uint8Array,
  data: string,
): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
}

async function signingKey(date: string): Promise<ArrayBuffer> {
  const kDate = await hmac(
    new TextEncoder().encode(`AWS4${SECRET_KEY}`),
    date,
  );
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  const kSigning = await hmac(kService, 'aws4_request');
  return kSigning;
}

function hexEncode(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sigv4Headers(
  method: string,
  key: string,
  body: Uint8Array | null,
  extraHeaders: Record<string, string> = {},
): Promise<Record<string, string>> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const host = `${ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const payloadHash = body
    ? await sha256Hex(body)
    : 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const headers: Record<string, string> = {
    host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
    ...extraHeaders,
  };

  const sortedHeaderNames = Object.keys(headers)
    .map((h) => h.toLowerCase())
    .sort();
  const canonicalHeaders = sortedHeaderNames
    .map((h) =>
      `${h}:${
        headers[Object.keys(headers).find((k) => k.toLowerCase() === h)!].trim()
      }`
    )
    .join('\n') + '\n';
  const signedHeaders = sortedHeaderNames.join(';');

  const canonicalUri = `/${BUCKET}/${
    key.split('/').map(encodeURIComponent).join('/')
  }`;
  const canonicalRequest = [
    method,
    canonicalUri,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const scope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    scope,
    await sha256Hex(canonicalRequest),
  ].join('\n');

  const key2 = await signingKey(dateStamp);
  const signature = hexEncode(await hmac(key2, stringToSign));

  headers['Authorization'] = [
    `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${scope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(', ');

  return headers;
}

async function headObject(key: string): Promise<boolean> {
  const headers = await sigv4Headers('HEAD', key, null);
  const res = await fetch(
    `${endpoint}/${BUCKET}/${key.split('/').map(encodeURIComponent).join('/')}`,
    { method: 'HEAD', headers },
  );
  if (res.status === 200) return true;
  if (res.status === 404) return false;
  throw new Error(`HEAD ${key} → ${res.status} ${await res.text()}`);
}

async function putObject(key: string, body: Uint8Array): Promise<void> {
  const headers = await sigv4Headers('PUT', key, body, {
    'content-type': contentTypeFor(key),
    'cache-control': 'public, immutable, max-age=31536000',
  });
  const res = await fetch(
    `${endpoint}/${BUCKET}/${key.split('/').map(encodeURIComponent).join('/')}`,
    { method: 'PUT', headers, body },
  );
  if (!res.ok) {
    throw new Error(`PUT ${key} → ${res.status} ${await res.text()}`);
  }
}

async function uploadOne(
  fullPath: string,
  rootDir: string,
): Promise<'uploaded' | 'skipped'> {
  const rel = relative(rootDir, fullPath);
  // Normalize path separators for object key (R2 stores keys verbatim).
  const key = rel.replaceAll('\\', '/');

  if (await headObject(key)) return 'skipped';

  const body = await Deno.readFile(fullPath);
  await putObject(key, body);
  return 'uploaded';
}

async function main(): Promise<void> {
  const immutableDir = `${SOURCE_DIR}/_app/immutable`;
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

  async function worker() {
    while (queue.length) {
      const path = queue.pop();
      if (!path) return;
      try {
        const result = await uploadOne(path, SOURCE_DIR);
        if (result === 'uploaded') uploaded++;
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

  if (failed > 0) Deno.exit(1);
}

await main();
