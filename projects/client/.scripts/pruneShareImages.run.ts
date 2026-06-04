/**
 * Entry point for the daily share image pruning job.
 * Connects to the R2 bucket via the S3-compatible API and
 * delegates pruning logic to pruneShareImages.
 */

import { buildTargetPrefixes } from '../src/routes/api/shareable-image/_internal/buildImagePath.ts';
import { pruneShareImages } from './pruneShareImages.ts';

const accountId = Deno.env.get('CLOUDFLARE_ACCOUNT_ID');
const accessKeyId = Deno.env.get('CLOUDFLARE_R2_ACCESS_KEY_ID');
const secretAccessKey = Deno.env.get('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
const bucketName = Deno.env.get('R2_BUCKET_NAME');

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  console.error(
    'Missing required env vars: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME',
  );
  Deno.exit(1);
}

const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

/**
 * Minimal S3-compatible R2 bucket client using AWS Signature V4.
 * Covers list (GET /?list-type=2) and delete (DELETE /<key>) operations.
 */

const REGION = 'auto';
const SERVICE = 's3';

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256(data: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(data),
  );
  return toHex(buf);
}

async function hmacSha256(
  key: BufferSource,
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

async function deriveSigningKey(
  secretKey: string,
  dateStamp: string,
): Promise<ArrayBuffer> {
  const kDate = await hmacSha256(
    new TextEncoder().encode(`AWS4${secretKey}`),
    dateStamp,
  );
  const kRegion = await hmacSha256(kDate, REGION);
  const kService = await hmacSha256(kRegion, SERVICE);
  return hmacSha256(kService, 'aws4_request');
}

async function signRequest(
  method: string,
  path: string,
  query: string,
  headers: Record<string, string>,
  body: string,
): Promise<string> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, 15) +
    'Z';
  const dateStamp = amzDate.slice(0, 8);

  headers['x-amz-date'] = amzDate;
  headers['x-amz-content-sha256'] = await sha256(body);

  const sortedHeaders = Object.keys(headers).sort();
  const canonicalHeaders = sortedHeaders
    .map((k) => `${k.toLowerCase()}:${headers[k]}\n`)
    .join('');
  const signedHeaders = sortedHeaders.map((k) => k.toLowerCase()).join(';');

  const canonicalRequest = [
    method,
    path,
    query,
    canonicalHeaders,
    signedHeaders,
    headers['x-amz-content-sha256'],
  ].join('\n');

  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256(canonicalRequest),
  ].join('\n');

  const signingKey = await deriveSigningKey(secretAccessKey!, dateStamp);
  const signature = toHex(await hmacSha256(signingKey, stringToSign));

  return `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

type ListResult = {
  objects: Array<{ key: string; customMetadata?: Record<string, string> }>;
  truncated: boolean;
  cursor?: string;
};

async function r2List(cursor?: string, prefix?: string): Promise<ListResult> {
  const queryParams: Record<string, string> = { 'list-type': '2' };
  if (cursor) {
    queryParams['continuation-token'] = cursor;
  }
  if (prefix) {
    queryParams['prefix'] = prefix;
  }

  const query = Object.entries(queryParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  const host = new URL(endpoint).host;
  const headers: Record<string, string> = { host };
  const authorization = await signRequest(
    'GET',
    `/${bucketName}`,
    query,
    headers,
    '',
  );

  const response = await fetch(`${endpoint}/${bucketName}?${query}`, {
    headers: { ...headers, authorization },
  });

  if (!response.ok) {
    throw new Error(
      `R2 list failed: ${response.status} ${await response.text()}`,
    );
  }

  const xml = await response.text();

  const keys = [...xml.matchAll(/<Key>([^<]+)<\/Key>/g)].map((m) => m[1]!);
  const truncated = xml.includes('<IsTruncated>true</IsTruncated>');
  const nextToken = xml.match(
    /<NextContinuationToken>([^<]+)<\/NextContinuationToken>/,
  )?.[1];

  // R2 S3 API does not return custom metadata in list responses;
  // metadata is read from head requests only when needed.
  const objects = keys.map((key) => ({ key, customMetadata: undefined }));

  return { objects, truncated, cursor: nextToken };
}

async function r2Head(
  key: string,
): Promise<Record<string, string> | undefined> {
  const host = new URL(endpoint).host;
  const encodedKey = key.split('/').map(encodeURIComponent).join('/');
  const headers: Record<string, string> = { host };
  const authorization = await signRequest(
    'HEAD',
    `/${bucketName}/${encodedKey}`,
    '',
    headers,
    '',
  );

  const response = await fetch(`${endpoint}/${bucketName}/${encodedKey}`, {
    method: 'HEAD',
    headers: { ...headers, authorization },
  });

  if (!response.ok) return undefined;

  const metadata: Record<string, string> = {};
  for (const [k, v] of response.headers.entries()) {
    if (k.startsWith('x-amz-meta-')) {
      metadata[k.slice('x-amz-meta-'.length)] = v;
    }
  }
  return metadata;
}

async function r2Delete(key: string): Promise<void> {
  const host = new URL(endpoint).host;
  const encodedKey = key.split('/').map(encodeURIComponent).join('/');
  const headers: Record<string, string> = { host };
  const authorization = await signRequest(
    'DELETE',
    `/${bucketName}/${encodedKey}`,
    '',
    headers,
    '',
  );

  const response = await fetch(`${endpoint}/${bucketName}/${encodedKey}`, {
    method: 'DELETE',
    headers: { ...headers, authorization },
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`R2 delete failed for ${key}: ${response.status}`);
  }
}

const bucket = {
  list: async (opts?: { cursor?: string; prefix?: string }) => {
    const raw = await r2List(opts?.cursor, opts?.prefix);

    // Hydrate custom metadata for each object via HEAD in chunks
    // to avoid socket exhaustion and rate limits (1000 per page is too bursty)
    const chunkSize = 50;
    const chunks = Array.from(
      { length: Math.ceil(raw.objects.length / chunkSize) },
      (_, i) => raw.objects.slice(i * chunkSize, (i + 1) * chunkSize),
    );
    const objects = await chunks.reduce(
      async (acc, chunk) => [
        ...(await acc),
        ...(await Promise.all(
          chunk.map(async ({ key }) => ({
            key,
            customMetadata: await r2Head(key),
          })),
        )),
      ],
      Promise.resolve(
        [] as {
          key: string;
          customMetadata: Record<string, string> | undefined;
        }[],
      ),
    );

    return { ...raw, objects };
  },
  delete: r2Delete,
};

const result = await pruneShareImages(bucket, buildTargetPrefixes());

console.log(
  `Prune complete — deleted: ${result.deleted}, skipped: ${result.skipped}, errors: ${result.errors}`,
);

if (result.errors > 0) {
  Deno.exit(1);
}
