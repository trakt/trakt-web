// Only the reads the GIF picker makes. Anything else is not proxied at all, so
// our key can never be pointed at a caller-chosen upstream path.
const CACHE_SECONDS: Record<string, number> = {
  'gifs/trending': 600,
  'gifs/search': 600,
  'gifs/categories': 43200,
  // Klipy keys recents off `customer_id`, so they are per device by
  // definition and must not be cached by anything in between.
  'gifs/recent': 0,
};

/**
 * The `Cache-Control` a proxied Klipy read answers with, or `null` when the
 * path is not one we proxy.
 */
export function toKlipyCacheControl(path: string): string | null {
  const seconds = CACHE_SECONDS[path];

  if (seconds == null) {
    return null;
  }

  return seconds > 0 ? `public, max-age=${seconds}` : 'no-store';
}
