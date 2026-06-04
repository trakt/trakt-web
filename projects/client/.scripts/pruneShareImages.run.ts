/**
 * Entry point for the daily share image pruning job.
 * Connects to the R2 bucket via the S3-compatible API and
 * delegates pruning logic to pruneShareImages.
 */

import { buildTargetPrefixes } from '../src/routes/api/shareable-image/_internal/buildTargetPrefixes.ts';
import { xmlUnescape } from './_internal/xml.ts';
import { pruneShareImages } from './pruneShareImages.ts';

function requireEnv(name: string): string {
  const value = Deno.env.get(name);

  if (!value) {
    console.error(`Missing required env var: ${name}`);
    Deno.exit(1);
  }

  return value;
}

const accountId = requireEnv('CLOUDFLARE_ACCOUNT_ID');
const accessKeyId = requireEnv('R2_ACCESS_KEY_ID');
const secretAccessKey = requireEnv('R2_SECRET_ACCESS_KEY');
const bucketName = requireEnv('R2_BUCKET_NAME');

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
  body: string,
): Promise<Record<string, string>> {
  const now = new Date();
  const amzDate = `${
    now.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, 15)
  }Z`;
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = await sha256(body);

  const headers: Record<string, string> = {
    host: new URL(endpoint).host,
    'x-amz-date': amzDate,
    'x-amz-content-sha256': payloadHash,
  };

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
    payloadHash,
  ].join('\n');

  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256(canonicalRequest),
  ].join('\n');

  const signingKey = await deriveSigningKey(secretAccessKey, dateStamp);
  const signature = toHex(await hmacSha256(signingKey, stringToSign));

  return {
    ...headers,
    authorization:
      `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
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

  const headers = await signRequest('GET', `/${bucketName}`, query, '');

  const response = await fetch(`${endpoint}/${bucketName}?${query}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `LIST ${prefix ?? 'root'} → ${response.status} ${await response.text()}`,
    );
  }

  const xml = await response.text();

  const keys = [...xml.matchAll(/<Key>([^<]+)<\/Key>/g)]
    .map((m) => xmlUnescape(m[1] ?? ''));
  const truncated = xml.includes('<IsTruncated>true</IsTruncated>');
  const nextToken = xml.match(
    /<NextContinuationToken>([^<]+)<\/NextContinuationToken>/,
  )?.[1];

  // R2 S3 API does not return custom metadata in list responses;
  // metadata is read from head requests only when needed.
  const objects = keys.map((key) => ({ key, customMetadata: undefined }));

  return {
    objects,
    truncated,
    cursor: nextToken ? xmlUnescape(nextToken) : undefined,
  };
}

async function r2Head(
  key: string,
): Promise<Record<string, string> | undefined> {
  const encodedKey = key.split('/').map(encodeURIComponent).join('/');
  const headers = await signRequest(
    'HEAD',
    `/${bucketName}/${encodedKey}`,
    '',
    '',
  );

  const response = await fetch(`${endpoint}/${bucketName}/${encodedKey}`, {
    method: 'HEAD',
    headers,
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
  const encodedKey = key.split('/').map(encodeURIComponent).join('/');
  const headers = await signRequest(
    'DELETE',
    `/${bucketName}/${encodedKey}`,
    '',
    '',
  );

  const response = await fetch(`${endpoint}/${bucketName}/${encodedKey}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(
      `DELETE ${key} → ${response.status} ${await response.text()}`,
    );
  }
}

const bucket = {
  list: async (opts?: { cursor?: string; prefix?: string }) => {
    const raw = await r2List(opts?.cursor, opts?.prefix);

    // Hydrate custom metadata for each object via HEAD in chunks
    // to avoid socket exhaustion and rate limits (1000 per page is too bursty)
    const chunkSize = 50;
    const objects: Array<{
      key: string;
      customMetadata: Record<string, string> | undefined;
    }> = [];

    for (let i = 0; i < raw.objects.length; i += chunkSize) {
      const chunk = raw.objects.slice(i, i + chunkSize);
      const hydrated = await Promise.all(
        chunk.map(async ({ key }) => ({
          key,
          customMetadata: await r2Head(key),
        })),
      );
      objects.push(...hydrated);
    }

    return { ...raw, objects };
  },
  delete: r2Delete,
};

const result = await pruneShareImages(bucket, buildTargetPrefixes());

console.log(
  `Prune complete. deleted: ${result.deleted}, skipped: ${result.skipped}, errors: ${result.errors}`,
);

if (result.errors > 0) {
  Deno.exit(1);
}
