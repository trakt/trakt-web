/**
 * File-extension → MIME mapping for immutable-asset uploads. The R2 sync
 * script does not negotiate; it sets `content-type` once at PUT time so
 * Cloudflare CDN can serve the bytes back with the right header.
 */

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
