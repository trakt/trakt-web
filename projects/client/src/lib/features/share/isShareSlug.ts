const SHARE_SLUG_PATTERN = /^[\w-]+(?:\.[\w-]+)*$/;

export function isShareSlug(slug: string): boolean {
  return SHARE_SLUG_PATTERN.test(slug);
}
