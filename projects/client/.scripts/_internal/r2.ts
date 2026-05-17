/**
 * Minimal R2 client over the S3-compatible API. Used by the immutable-asset
 * sync and prune scripts.
 *
 * Caller supplies credentials + bucket. We sign requests with AWS SigV4
 * (the auth scheme R2 inherits from its S3 compatibility) and issue raw
 * fetch() calls — no aws-sdk dependency, runs in plain Deno on GitHub
 * Actions runners.
 */

export type R2ClientConfig = {
  accountId: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
};

const REGION = 'auto';
const SERVICE = 's3';
const EMPTY_BODY_SHA256 =
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

function hex(buf: ArrayBuffer | Uint8Array): string {
  const view = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return [...view].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(data: Uint8Array | string): Promise<string> {
  const buf = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return hex(hash);
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

function encodeKey(key: string): string {
  return key.split('/').map(encodeURIComponent).join('/');
}

function xmlEscape(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function xmlUnescape(value: string): string {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');
}

export class R2Client {
  readonly endpoint: string;

  constructor(private readonly config: R2ClientConfig) {
    this.endpoint = `https://${config.accountId}.r2.cloudflarestorage.com`;
  }

  private async signingKey(date: string): Promise<ArrayBuffer> {
    const kDate = await hmac(
      new TextEncoder().encode(`AWS4${this.config.secretKey}`),
      date,
    );
    const kRegion = await hmac(kDate, REGION);
    const kService = await hmac(kRegion, SERVICE);
    return hmac(kService, 'aws4_request');
  }

  private async sign(
    method: string,
    pathSuffix: string,
    query: string,
    body: Uint8Array | null,
    extraHeaders: Record<string, string> = {},
  ): Promise<Record<string, string>> {
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);
    const host = `${this.config.accountId}.r2.cloudflarestorage.com`;
    const payloadHash = body ? await sha256Hex(body) : EMPTY_BODY_SHA256;

    const headers: Record<string, string> = {
      host,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
      ...extraHeaders,
    };

    const normalizedHeaders = Object.fromEntries(
      Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v.trim()]),
    );
    const sortedHeaderNames = Object.keys(normalizedHeaders).sort();
    const canonicalHeaders = `${
      sortedHeaderNames
        .map((h) => `${h}:${normalizedHeaders[h]}`)
        .join('\n')
    }\n`;
    const signedHeaders = sortedHeaderNames.join(';');

    const canonicalRequest = [
      method,
      pathSuffix,
      query,
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join('\n');

    const scope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      amzDate,
      scope,
      await sha256Hex(canonicalRequest),
    ].join('\n');

    const signature = hex(
      await hmac(await this.signingKey(dateStamp), stringToSign),
    );

    headers['Authorization'] = [
      `AWS4-HMAC-SHA256 Credential=${this.config.accessKey}/${scope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`,
    ].join(', ');

    return headers;
  }

  private keyPath(key: string): string {
    return `/${this.config.bucket}/${encodeKey(key)}`;
  }

  private url(key: string, query = ''): string {
    return `${this.endpoint}${this.keyPath(key)}${query ? `?${query}` : ''}`;
  }

  async head(key: string): Promise<boolean> {
    const pathSuffix = this.keyPath(key);
    const headers = await this.sign('HEAD', pathSuffix, '', null);
    const res = await fetch(this.url(key), { method: 'HEAD', headers });
    if (res.status === 200) return true;
    if (res.status === 404) return false;
    throw new Error(`HEAD ${key} → ${res.status} ${await res.text()}`);
  }

  async put(
    key: string,
    body: Uint8Array,
    extra: Record<string, string> = {},
  ): Promise<void> {
    const pathSuffix = this.keyPath(key);
    const headers = await this.sign('PUT', pathSuffix, '', body, extra);
    const res = await fetch(this.url(key), { method: 'PUT', headers, body });
    if (!res.ok) {
      throw new Error(`PUT ${key} → ${res.status} ${await res.text()}`);
    }
  }

  async getText(key: string): Promise<string> {
    const pathSuffix = this.keyPath(key);
    const headers = await this.sign('GET', pathSuffix, '', null);
    const res = await fetch(this.url(key), { method: 'GET', headers });
    if (!res.ok) {
      throw new Error(`GET ${key} → ${res.status} ${await res.text()}`);
    }
    return res.text();
  }

  /**
   * Iterates every key under a prefix (paginated by the S3 list API).
   */
  async *list(prefix: string): AsyncGenerator<string, void, unknown> {
    let continuationToken: string | undefined;
    do {
      const params = new URLSearchParams({
        'list-type': '2',
        prefix,
      });
      if (continuationToken) {
        params.set('continuation-token', continuationToken);
      }
      const query = params.toString();
      const pathSuffix = `/${this.config.bucket}`;
      const headers = await this.sign('GET', pathSuffix, query, null);
      const res = await fetch(
        `${this.endpoint}${pathSuffix}?${query}`,
        { method: 'GET', headers },
      );
      if (!res.ok) {
        throw new Error(
          `LIST ${prefix} → ${res.status} ${await res.text()}`,
        );
      }
      const xml = await res.text();
      const keys = [...xml.matchAll(/<Key>([^<]+)<\/Key>/g)].map((m) =>
        xmlUnescape(m[1])
      );
      for (const k of keys) yield k;

      const isTruncated = /<IsTruncated>true<\/IsTruncated>/.test(xml);
      const tokenMatch = xml.match(
        /<NextContinuationToken>([^<]+)<\/NextContinuationToken>/,
      );
      continuationToken = isTruncated && tokenMatch
        ? xmlUnescape(tokenMatch[1])
        : undefined;
    } while (continuationToken);
  }

  /**
   * Deletes up to 1000 keys per batch via the S3 multi-object delete API.
   */
  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    for (let i = 0; i < keys.length; i += 1000) {
      const batch = keys.slice(i, i + 1000);
      const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>
<Delete>
${
        batch.map((k) => `  <Object><Key>${xmlEscape(k)}</Key></Object>`).join(
          '\n',
        )
      }
</Delete>`;
      const body = new TextEncoder().encode(xmlBody);
      const md5 = await crypto.subtle.digest('MD5', body)
        .catch(() => null);
      const headers: Record<string, string> = {
        'content-type': 'application/xml',
      };
      if (md5) {
        headers['content-md5'] = btoa(
          String.fromCharCode(...new Uint8Array(md5)),
        );
      }
      const pathSuffix = `/${this.config.bucket}`;
      const signed = await this.sign(
        'POST',
        pathSuffix,
        'delete=',
        body,
        headers,
      );
      const res = await fetch(`${this.endpoint}${pathSuffix}?delete`, {
        method: 'POST',
        headers: signed,
        body,
      });
      if (!res.ok) {
        throw new Error(
          `DELETE batch → ${res.status} ${await res.text()}`,
        );
      }
    }
  }
}

export function r2FromEnv(): R2Client {
  const accountId = Deno.env.get('CLOUDFLARE_ACCOUNT_ID');
  const accessKey = Deno.env.get('R2_ACCESS_KEY_ID');
  const secretKey = Deno.env.get('R2_SECRET_ACCESS_KEY');
  const bucket = Deno.env.get('R2_IMMUTABLE_BUCKET') ?? 'trakt-web-immutable';

  if (!accountId || !accessKey || !secretKey) {
    console.error(
      'Missing CLOUDFLARE_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY',
    );
    Deno.exit(1);
  }

  return new R2Client({ accountId, accessKey, secretKey, bucket });
}

export const RELEASE_MANIFEST_PREFIX = 'releases/';
export const IMMUTABLE_PREFIX = '_app/immutable/';

export type ReleaseManifest = {
  sha: string;
  uploadedAt: string;
  keys: string[];
};

export function manifestKeyFor(sha: string, now: Date = new Date()): string {
  const iso = now.toISOString().replace(/[:.]/g, '-');
  return `${RELEASE_MANIFEST_PREFIX}${iso}_${sha}.json`;
}

/**
 * Reverse of {@link manifestKeyFor}. Returns `null` if the key does not
 * match the expected `releases/<ISO-flattened>_<sha>.json` shape, which
 * keeps stray objects (manual uploads, partial writes) from being treated
 * as deploys when computing retention.
 */
export function manifestKeyToDate(key: string): Date | null {
  const stem = key
    .replace(new RegExp(`^${RELEASE_MANIFEST_PREFIX}`), '')
    .replace(/\.json$/, '');
  const [encodedIso] = stem.split('_');
  if (!encodedIso) return null;

  // encodedIso shape: YYYY-MM-DDTHH-MM-SS-mmmZ
  const match = encodedIso.match(
    /^(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/,
  );
  if (!match) return null;
  const [, datePart, hh, mm, ss, ms] = match;
  const iso = `${datePart}T${hh}:${mm}:${ss}.${ms}Z`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

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

export function contentTypeFor(key: string): string {
  const ext = key.split('.').pop()?.toLowerCase() ?? '';
  return CONTENT_TYPE_BY_EXT[ext] ?? 'application/octet-stream';
}
