import type { Handle } from '@sveltejs/kit';

const IMMUTABLE_PREFIX = '/_app/immutable/';

// Cloudflare's recommended cache directive for immutable assets.
const IMMUTABLE_CACHE_CONTROL = 'public, immutable, max-age=31536000';

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

function contentTypeForKey(key: string): string {
  const ext = key.split('.').pop()?.toLowerCase() ?? '';
  return CONTENT_TYPE_BY_EXT[ext] ?? 'application/octet-stream';
}

// Retains chunks/CSS/assets emitted by previous deploys so clients still
// serving cached HTML (referencing older hashed chunk names) can resolve
// their assets after a redeploy. Synced additively to R2 by CI.
export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  if (!pathname.startsWith(IMMUTABLE_PREFIX)) {
    return resolve(event);
  }

  // Strip the leading slash so the R2 key matches the on-disk layout
  // (`_app/immutable/...`) we sync from `.svelte-kit/cloudflare/`.
  const key = pathname.slice(1);

  const bucket = event.platform?.env?.R2_IMMUTABLE;
  if (!bucket) {
    return resolve(event);
  }

  const object = await bucket.get(key);
  if (!object) {
    return resolve(event);
  }

  const meta = object.httpMetadata ?? {};
  const headers = new Headers({
    etag: object.httpEtag,
    'cache-control': meta.cacheControl ?? IMMUTABLE_CACHE_CONTROL,
    'content-type': meta.contentType ?? contentTypeForKey(key),
  });

  if (meta.contentEncoding) {
    headers.set('content-encoding', meta.contentEncoding);
  }
  if (meta.contentLanguage) {
    headers.set('content-language', meta.contentLanguage);
  }
  if (meta.contentDisposition) {
    headers.set('content-disposition', meta.contentDisposition);
  }

  const body = await object.arrayBuffer();
  return new Response(body, { headers });
};
