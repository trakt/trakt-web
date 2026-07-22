export function hasSlug<T extends { slug?: string }>(
  document: T,
): document is T & { slug: string } {
  return document.slug != null;
}
