const CACHE_PREFIX = 'trakt-lite';

function buildCacheKey(key: string) {
  return `${CACHE_PREFIX}-${key}`;
}

export const CacheKey = {
  manifest: buildCacheKey('manifest'),
  static: buildCacheKey('static-assets'),
  navigation: buildCacheKey('navigation'),
  external: buildCacheKey('external-resources'),
  images: buildCacheKey('images'),
} as const;
