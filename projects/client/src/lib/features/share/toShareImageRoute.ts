import { isShareSlug } from './isShareSlug.ts';

const SHARE_IMAGE_PATTERN = /^\/users\/([^/]+)\/(mir|yir)\.jpg$/;

export function toShareImageRoute(pathname: string): string | undefined {
  const [, slug, kind] = SHARE_IMAGE_PATTERN.exec(pathname) ?? [];

  return slug && kind && isShareSlug(slug)
    ? `/api/shareable-image/${kind}/${slug}`
    : undefined;
}
