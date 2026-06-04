/**
 * Minimal R2 client over the S3-compatible API. Used by the immutable-asset
 * sync and prune scripts.
 *
 * Caller supplies credentials + bucket. We sign requests with AWS SigV4
 * (the auth scheme R2 inherits from its S3 compatibility) and issue raw
 * fetch() calls — no aws-sdk dependency, runs in plain Deno on GitHub
 * Actions runners.
 */

import { xmlEscape, xmlUnescape } from './xml.ts';

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
const META_HEADER_PREFIX = 'x-amz-meta-';

function hex(buf: ArrayBuffer | Uint8Array): string {
  const view = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return [...view].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(
  data: Uint8Array<ArrayBuffer> | string,
): Promise<string> {
  const buf = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return hex(hash);
}

async function hmac(
  key: ArrayBuffer | Uint8Array<ArrayBuffer>,
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
    body: Uint8Array<ArrayBuffer> | null,
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

  /** R2 lowercases the metadata names it stores. */
  async headMetadata(key: string): Promise<Record<string, string> | undefined> {
    const headers = await this.sign('HEAD', this.keyPath(key), '', null);
    const res = await fetch(this.url(key), { method: 'HEAD', headers });
    if (!res.ok) return undefined;

    return Object.fromEntries(
      [...res.headers.entries()]
        .filter(([name]) => name.startsWith(META_HEADER_PREFIX))
        .map(([name, value]) => [
          name.slice(META_HEADER_PREFIX.length),
          value,
        ]),
    );
  }

  async delete(key: string): Promise<void> {
    const headers = await this.sign('DELETE', this.keyPath(key), '', null);
    const res = await fetch(this.url(key), { method: 'DELETE', headers });
    if (!res.ok && res.status !== 204) {
      throw new Error(`DELETE ${key} → ${res.status} ${await res.text()}`);
    }
  }

  async put(
    key: string,
    body: Uint8Array<ArrayBuffer>,
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

  async listPage(
    { prefix, cursor }: { prefix?: string; cursor?: string },
  ): Promise<{ keys: string[]; cursor?: string }> {
    const params = new URLSearchParams({ 'list-type': '2' });
    if (prefix) params.set('prefix', prefix);
    if (cursor) params.set('continuation-token', cursor);

    // SigV4 canonicalises the query sorted by name and %-encoded.
    const query = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    const pathSuffix = `/${this.config.bucket}`;
    const headers = await this.sign('GET', pathSuffix, query, null);
    const res = await fetch(
      `${this.endpoint}${pathSuffix}?${query}`,
      { method: 'GET', headers },
    );
    if (!res.ok) {
      throw new Error(
        `LIST ${prefix ?? 'root'} → ${res.status} ${await res.text()}`,
      );
    }

    const xml = await res.text();
    const keys = [...xml.matchAll(/<Key>([^<]+)<\/Key>/g)].map((m) =>
      xmlUnescape(m[1] ?? '')
    );
    const isTruncated = /<IsTruncated>true<\/IsTruncated>/.test(xml);
    const token = xml.match(
      /<NextContinuationToken>([^<]+)<\/NextContinuationToken>/,
    )?.[1];

    return {
      keys,
      cursor: isTruncated && token ? xmlUnescape(token) : undefined,
    };
  }

  /**
   * Iterates every key under a prefix (paginated by the S3 list API).
   */
  async *list(prefix: string): AsyncGenerator<string, void, unknown> {
    let cursor: string | undefined;
    do {
      const page = await this.listPage({ prefix, cursor });
      for (const key of page.keys) yield key;
      cursor = page.cursor;
    } while (cursor);
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
