const SHARE_PREFIX = 'gifs/share/';

// Klipy slugs are word characters and dashes; anything else is not a slug and
// must not reach a url built with our key.
const SLUG_PATTERN = /^[\w-]{1,128}$/;

/**
 * The slug of the gif a share ping is for, or `null` when the path is not a
 * share ping for a real slug.
 */
export function toKlipyShareSlug(path: string): string | null {
  if (!path.startsWith(SHARE_PREFIX)) {
    return null;
  }

  const slug = path.slice(SHARE_PREFIX.length);

  return SLUG_PATTERN.test(slug) ? slug : null;
}
